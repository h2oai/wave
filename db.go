package telesync

import (
	"encoding/json"
	"errors"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"regexp"
	"strconv"
	"strings"
	"sync"

	"github.com/bvinc/go-sqlite-lite/sqlite3"
)

const dbLogo = `
   __       __         ____  
  / /____  / /__  ____/ / /_ 
 / __/ _ \/ / _ \/ __  / __ \
/ /_/  __/ /  __/ /_/ / /_/ /
\__/\___/_/\___/\__,_/_.___/ 
`

//
// TeleDB is an ACID-compliant database server atop SQLite3,
// using JSON over HTTP as a protocol.
//
// It is super simple, not geographically distributed, not multi-region,
// not cloud and not even web scale. It does not even have machine learning and AI.
//
// SQLite is fast and reliable and it requires no configuration or maintenance.
// It keeps things simple.  SQLite "just works".
//
// Database requests are serialized by the server, so concurrency is not an issue.
// For low writer concurrency (< 256) and less than a terabyte of content
// (theoretically 140TB), SQLite supports unlimited read concurrency, and is
// almost always a better solution than a client/server SQL database engine.
//
// Concurrency can also improved by sharding, in which case DS can be made
// to use separate SQLite database files for each shard. Depending on the use case,
// clients might choose to have a separate shard per subject, so that the
// server can handle hundreds or thousands of simultaneous connections, but
// each shard is only used by one connection.
//
// Sharding is automatic, and DS will use the database name specified
// in each request to initialize new shards if missing.
//
// Requests the server are always handled in batches, and transactions are
// automatically enabled for requests containing more than one query per batch.
//
// JSON1, RTREE, FTS5, GEOPOLY, STAT4, and SOUNDEX extensions are built in.
//
// WAL mode and foreign key constraints are enabled.
//

// DS represents a data store
type DS struct {
	catalog *Catalog
}

// NewDS mints a new data store.
func NewDS() *DS {
	return &DS{newCatalog()}
}

// Run runs runs the server.
func (ds *DS) Run(addr string) {
	http.HandleFunc("/", ds.handle)

	for _, line := range strings.Split(dbLogo, "\n") {
		log.Println(line)
	}
	log.Println("listening", addr)

	log.Fatal(http.ListenAndServe(addr, nil))
}

// DBRequest represents a database request.
type DBRequest struct {
	Exec *ExecRequest `json:"exec"`
	Drop *DropRequest `json:"drop"`
}

// DBReply represents a database reply.
type DBReply struct {
	Result interface{} `json:"result"`
	Error  string      `json:"error"`
}

// ExecRequest is used to execute statements.
type ExecRequest struct {
	Database   string `json:"database"`
	Statements []Stmt `json:"statements"`
}

// ExecReply is the reply from Exec().
type ExecReply struct {
	Results [][][]interface{} `json:"results"`
}

// Stmt represents a SQL statement.
type Stmt struct {
	Query  string        `json:"query"`
	Params []interface{} `json:"params"`
}

// DropRequest is used to drop a database
type DropRequest struct {
	Database string `json:"database"`
}

const (
	sqlite3BusyTimeout = 5000
)

var (
	rxDatabaseName = regexp.MustCompile(`^\w+$`)
	errBadRequest  = errors.New("bad request")
)

func (ds *DS) handle(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodPost:
		switch r.Header.Get("Content-Type") {
		case "application/json":
			var request DBRequest
			in, err := ioutil.ReadAll(r.Body) // XXX add limit
			if err != nil {
				http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
				return
			}
			if err := json.Unmarshal(in, &request); err != nil {
				http.Error(w, http.StatusText(http.StatusBadRequest), http.StatusBadRequest)
				return
			}

			reply := ds.process(request)

			out, err := json.Marshal(reply)
			if err != nil {
				http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
				return
			}
			w.Header().Set("Content-Type", contentTypeJSON)
			w.Write(out)
			return
		}
	}
	http.Error(w, http.StatusText(http.StatusBadRequest), http.StatusBadRequest)
}

func (ds *DS) process(req DBRequest) DBReply {
	if req.Exec != nil {
		reply, err := ds.exec(*req.Exec)
		if err != nil {
			return DBReply{nil, err.Error()}
		}
		return DBReply{reply, ""}
	}
	if req.Drop != nil {
		err := ds.drop(*req.Drop)
		if err != nil {
			return DBReply{nil, err.Error()}
		}
		return DBReply{nil, ""}
	}
	return DBReply{Error: errBadRequest.Error()}
}

func (ds *DS) exec(req ExecRequest) (ExecReply, error) {
	db, err := ds.catalog.load(req.Database)
	if err != nil {
		return ExecReply{}, err
	}
	results, err := db.exec(req.Statements)
	return ExecReply{results}, err
}

func (ds *DS) drop(req DropRequest) error {
	return ds.catalog.drop(req.Database)
}

// Catalog represents a collection of databases.
type Catalog struct {
	sync.RWMutex
	databases map[string]*DB
}

func newCatalog() *Catalog {
	return &Catalog{databases: make(map[string]*DB)}
}

func (c *Catalog) get(name string) *DB {
	c.RLock()
	defer c.RUnlock()
	if db, ok := c.databases[name]; ok {
		return db
	}
	return nil
}

func (c *Catalog) load(name string) (*DB, error) {
	if db := c.get(name); db != nil {
		return db, nil
	}

	if err := validateDatabaseName(name); err != nil {
		return nil, err
	}

	db, err := newDB(name + ".db")
	if err != nil {
		return nil, err
	}

	c.Lock()
	c.databases[name] = db
	c.Unlock()

	return db, nil
}

func (c *Catalog) drop(name string) error {
	db := c.get(name)
	if db == nil {
		return fmt.Errorf("database not found: %s", name)
	}

	if err := validateDatabaseName(name); err != nil {
		return err
	}

	c.Lock()
	defer c.Unlock()
	delete(c.databases, name)
	return os.Remove(name + ".db")
}

func validateDatabaseName(name string) error {
	if !rxDatabaseName.MatchString(name) {
		return fmt.Errorf("invalid database name: %s", name)
	}
	return nil
}

// DB controls access to a single SQLite3 database file.
type DB struct {
	filename string
	pragmas  []string // pragmas that need to be set on each new connection per sqlite3 docs.
}

func newDB(filename string) (*DB, error) {
	db := &DB{
		filename,
		[]string{
			"pragma busy_timeout=" + strconv.Itoa(sqlite3BusyTimeout),
			"pragma foreign_keys=on",
		},
	}

	conn, err := db.open()
	if err != nil {
		return nil, fmt.Errorf("failed opening database at %s: %v", filename, err)
	}
	defer conn.Close()

	if err := conn.Exec(`pragma journal_mode=wal`); err != nil {
		return nil, fmt.Errorf("failed setting WAL mode: %v", err)
	}

	return db, nil
}

func (db *DB) open() (*sqlite3.Conn, error) {
	conn, err := sqlite3.Open(db.filename)
	if err != nil {
		return nil, fmt.Errorf("failed opening database: %v", err)
	}

	for _, pragma := range db.pragmas {
		if err := conn.Exec(pragma); err != nil {
			return nil, fmt.Errorf("failed setting pragma: %v", err)
		}
	}

	return conn, nil
}

func scan(s *sqlite3.Stmt, i int) (v interface{}, ok bool, err error) {
	switch t := s.ColumnType(int(i)); t {
	case sqlite3.INTEGER:
		v, ok, err = s.ColumnInt64(i)
	case sqlite3.FLOAT:
		v, ok, err = s.ColumnDouble(i)
	case sqlite3.TEXT:
		v, ok, err = s.ColumnText(i)
	case sqlite3.BLOB:
		ok = true
		v, err = s.ColumnBlob(i)
	case sqlite3.NULL:
		v = nil
	default:
		err = fmt.Errorf("unknown column type (%d)", t)
	}
	return
}

func (db *DB) exec(stmts []Stmt) ([][][]interface{}, error) {
	k := len(stmts)
	if k == 0 {
		return nil, nil
	}

	conn, err := db.open()
	if err != nil {
		return nil, err
	}
	defer conn.Close()

	tx := k > 1

	if tx {
		if err := conn.Begin(); err != nil {
			return nil, fmt.Errorf("failed to begin transaction: %v", err)
		}
	}

	results := make([][][]interface{}, k)

	for i, stmt := range stmts {
		result, err := db.query(conn, stmt.Query, stmt.Params)
		if err != nil {
			if tx {
				if err2 := conn.Rollback(); err2 != nil {
					return nil, fmt.Errorf("%v; additionally, rolling back transaction failed: %v", err, err2)
				}
			}
			return nil, err
		}
		results[i] = result
	}

	if tx {
		if err := conn.Commit(); err != nil {
			return nil, fmt.Errorf("failed to commit transaction: %v", err)
		}
	}

	return results, nil
}

func (db *DB) query(conn *sqlite3.Conn, sql string, args []interface{}) ([][]interface{}, error) {
	stmt, err := conn.Prepare(sql, args...)
	if err != nil {
		return nil, fmt.Errorf("failed preparing statement: %s: %v", sql, err)
	}
	defer stmt.Close()

	var rows [][]interface{}
	for {
		hasRow, err := stmt.Step()
		if err != nil {
			return nil, fmt.Errorf("failed stepping statement: %s: %v", sql, err)
		}
		if !hasRow {
			break
		}

		cols := stmt.ColumnCount()
		row := make([]interface{}, cols)

		for i := 0; i < cols; i++ {
			v, ok, err := scan(stmt, i)
			if err != nil {
				return nil, fmt.Errorf("failed scanning column %d: %s: %v", i, sql, err)
			}
			if ok {
				row[i] = v
			}
		}
		rows = append(rows, row)
	}
	return rows, nil
}
