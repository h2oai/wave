// Copyright 2020 H2O.ai, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package db

import (
	"encoding/json"
	"errors"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"regexp"
	"strconv"
	"strings"
	"sync"

	"github.com/h2oai/wave/pkg/keychain"
	"github.com/lo5/sqlite3"
)

const logo = `
┌────────┐┌────┐ H2O WaveDB
│  ┐┌┐┐┌─┘│─┐  │ %s %s
│  └┘└┘└─┘└─┘  │ © 2021 H2O.ai, Inc.
└──────────────┘
`

//
// WaveDB is an ACID-compliant database server atop SQLite3,
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
// Concurrency can also improved by sharding, in which case WaveDB can be made
// to use separate SQLite database files for each shard. Depending on the use case,
// clients might choose to have a separate shard per subject, so that the
// server can handle hundreds or thousands of simultaneous connections, but
// each shard is only used by one connection.
//
// Sharding is automatic, and WaveDB will use the database name specified
// in each request to initialize new shards if missing.
//
// JSON1, RTREE, FTS5, GEOPOLY, STAT4, and SOUNDEX extensions are built in.
//
// WAL mode and foreign key constraints are enabled.
//

// DSConf represents data store configuration options.
type DSConf struct {
	Version   string
	BuildDate string
	Listen    string
	CertFile  string
	KeyFile   string
	Keychain  *keychain.Keychain
	Dir       string
	Verbose   bool
}

// DS represents a data store
type DS struct {
	keychain *keychain.Keychain
	catalog  *Catalog
	conf     DSConf
}

func newDS(conf DSConf) *DS {
	return &DS{conf.Keychain, newCatalog(conf.Dir, conf.Verbose), conf}
}

// Run runs runs the server.
func Run(conf DSConf) {
	ds := newDS(conf)

	http.HandleFunc("/", ds.handle)

	for _, line := range strings.Split(fmt.Sprintf(logo, conf.Version, conf.BuildDate), "\n") {
		log.Println(line)
	}
	log.Println("listening", conf.Listen)

	if conf.CertFile != "" && conf.KeyFile != "" {
		log.Fatal(http.ListenAndServeTLS(conf.Listen, conf.CertFile, conf.KeyFile, nil))
	} else {
		log.Fatal(http.ListenAndServe(conf.Listen, nil))
	}
}

// DBRequest represents a database request.
type DBRequest struct {
	Exec *ExecRequest `json:"e"`
	Drop *DropRequest `json:"d"`
}

type ErrorReply struct {
	Error string `json:"e"`
}

// ExecRequest is used to execute statements.
type ExecRequest struct {
	Database   string `json:"d"`
	Statements []Stmt `json:"s"`
	Atomicity  uint8  `json:"a"`
}

// ExecReply is the reply from Exec().
type ExecReply struct {
	Results [][][]interface{} `json:"r"`
	Error   string            `json:"e"`
}

// Stmt represents a SQL statement.
type Stmt struct {
	Query  string        `json:"q"`
	Params []interface{} `json:"p"`
}

// DropRequest is used to drop a database
type DropRequest struct {
	Database string `json:"d"`
}

type DropReply struct {
	Error string `json:"e"`
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
	case http.MethodGet, http.MethodPost:
		switch r.Header.Get("Content-Type") {
		case "application/json":
			if !ds.keychain.Guard(w, r) {
				return
			}
			var request DBRequest
			in, err := ioutil.ReadAll(http.MaxBytesReader(w, r.Body, 5<<20)) // limit to 5MB per request
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
			w.Header().Set("Content-Type", "application/json")
			w.Write(out)
			return
		}
	}
	http.Error(w, http.StatusText(http.StatusBadRequest), http.StatusBadRequest)
}

func (ds *DS) process(req DBRequest) interface{} {
	if req.Exec != nil {
		reply, err := ds.exec(*req.Exec)
		if err != nil {
			if ds.conf.Verbose {
				log.Printf("error: %s", err.Error())
			}
			return ExecReply{nil, err.Error()}
		}
		return ExecReply{reply, ""}
	}
	if req.Drop != nil {
		err := ds.drop(*req.Drop)
		if err != nil {
			return DropReply{err.Error()}
		}
		return DropReply{""}
	}
	return ErrorReply{errBadRequest.Error()}
}

func (ds *DS) exec(req ExecRequest) ([][][]interface{}, error) {
	db, err := ds.catalog.load(req.Database)
	if err != nil {
		return nil, err
	}
	return db.exec(req.Statements, req.Atomicity > 0)
}

func (ds *DS) drop(req DropRequest) error {
	return ds.catalog.drop(req.Database)
}

// Catalog represents a collection of databases.
type Catalog struct {
	sync.RWMutex
	dir       string
	databases map[string]*DB
	verbose   bool
}

func newCatalog(dir string, verbose bool) *Catalog {
	return &Catalog{
		dir:       dir,
		databases: make(map[string]*DB),
		verbose:   verbose,
	}
}

func (c *Catalog) get(name string) *DB {
	c.RLock()
	defer c.RUnlock()
	if db, ok := c.databases[name]; ok {
		return db
	}
	return nil
}

func (c *Catalog) locate(name string) string {
	return filepath.Join(c.dir, name+".db")
}

func (c *Catalog) load(name string) (*DB, error) {
	if db := c.get(name); db != nil {
		return db, nil
	}

	if err := validateDatabaseName(name); err != nil {
		return nil, err
	}

	db, err := newDB(c.locate(name), c.verbose)
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
	return os.Remove(c.locate(name))
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
	verbose  bool
}

func newDB(filename string, verbose bool) (*DB, error) {
	db := &DB{
		filename,
		[]string{
			"pragma busy_timeout=" + strconv.Itoa(sqlite3BusyTimeout),
			"pragma foreign_keys=on",
		},
		verbose,
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

func (db *DB) log(query string, params []interface{}) {
	if len(params) == 0 {
		log.Println(query)
		return
	}

	xs := make([]string, len(params))
	for i, x := range params {
		xs[i] = fmt.Sprintf("%#v", x)
	}
	log.Printf("%s; [ %s ]", query, strings.Join(xs, ", "))
}

func (db *DB) exec(stmts []Stmt, atomic bool) ([][][]interface{}, error) {
	k := len(stmts)
	if k == 0 {
		return nil, nil
	}

	conn, err := db.open()
	if err != nil {
		return nil, err
	}
	defer conn.Close()

	if atomic {
		if err := conn.Begin(); err != nil {
			return nil, fmt.Errorf("failed to begin transaction: %v", err)
		}
	}

	results := make([][][]interface{}, k)

	for i, stmt := range stmts {
		if db.verbose {
			db.log(stmt.Query, stmt.Params)
		}
		result, err := db.query(conn, stmt.Query, stmt.Params)
		if err != nil {
			if atomic {
				if err2 := conn.Rollback(); err2 != nil {
					return nil, fmt.Errorf("%v; additionally, rolling back transaction failed: %v", err, err2)
				}
			}
			return nil, err
		}
		results[i] = result
	}

	if atomic {
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
