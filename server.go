package telesync

import (
	"bufio"
	"bytes"
	"encoding/json"
	"io/ioutil"
	"log"
	"net/http"
	"net/url"
	"os"
	"path"
	"strings"
	"time"

	"golang.org/x/crypto/bcrypt"
)

const logo = `
   __       __
  / /____  / /__  _______  ______  _____
 / __/ _ \/ / _ \/ ___/ / / / __ \/ ___/
/ /_/  __/ /  __(__  ) /_/ / / / / /__
\__/\___/_/\___/____/\__, /_/ /_/\___/
                    /____/
`

// Log represents key-value data for a log message.
type Log map[string]string

func echo(m Log) {
	if j, err := json.Marshal(m); err == nil { // TODO speed up
		log.Println("#", string(j))
	}
}

// WebServer represents a web server (d'oh).
type WebServer struct {
	site   *Site
	broker *Broker
	fs     http.Handler
	users  map[string][]byte
}

const (
	contentTypeJSON = "application/json"
)

func newWebServer(site *Site, broker *Broker, users map[string][]byte, www string) *WebServer {
	return &WebServer{
		site,
		broker,
		// http.StripPrefix("/fs", http.FileServer(http.Dir(www))),
		fallback("/", http.FileServer(http.Dir(www))),
		users,
	}
}

func fallback(prefix string, h http.Handler) http.Handler {
	// copy of http.StripPrefix
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// if the url has an extension, serve the file
		if len(path.Ext(r.URL.Path)) > 0 {
			h.ServeHTTP(w, r)
			return
		}
		// rewrite
		r2 := new(http.Request)
		*r2 = *r
		r2.URL = new(url.URL)
		*r2.URL = *r.URL
		r2.URL.Path = prefix
		h.ServeHTTP(w, r2)
	})
}

func (s *WebServer) authenticate(username, password string) bool {
	hash, ok := s.users[username]
	if !ok {
		return false
	}
	err := bcrypt.CompareHashAndPassword(hash, []byte(password))
	return err == nil
}

func (s *WebServer) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	url := r.URL.Path
	switch r.Method {
	case http.MethodPatch: // writes
		username, password, ok := r.BasicAuth()
		if !ok || !s.authenticate(username, password) {
			http.Error(w, http.StatusText(http.StatusUnauthorized), http.StatusUnauthorized)
			return
		}

		data, err := ioutil.ReadAll(r.Body) // XXX add limit
		if err != nil {
			echo(Log{"t": "read patch request body", "error": err.Error()})
			http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
			return
		}
		s.broker.patch(url, data)

	case http.MethodGet: // reads
		// TODO auth
		switch r.Header.Get("Content-Type") {
		case contentTypeJSON: // data
			page := s.site.at(url)
			if page == nil {
				echo(Log{"t": "page_not_found", "url": url})
				http.Error(w, http.StatusText(http.StatusNotFound), http.StatusNotFound)
				return
			}

			data := page.marshal()
			if data == nil {
				echo(Log{"t": "cache_miss", "url": url})
				http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
				return
			}
			w.Header().Set("Content-Type", contentTypeJSON)
			w.Write(data)
		default: // template
			s.fs.ServeHTTP(w, r)
		}
	case http.MethodPost: // all other APIs
		// TODO auth
		switch r.Header.Get("Content-Type") {
		case contentTypeJSON: // data
			var req RelayRequest
			b, err := ioutil.ReadAll(r.Body) // XXX add limit
			if err != nil {
				echo(Log{"t": "read post request body", "error": err.Error()})
				http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
				return
			}
			if err := json.Unmarshal(b, &req); err != nil {
				echo(Log{"t": "json_unmarshal", "error": err.Error()})
				http.Error(w, http.StatusText(http.StatusBadRequest), http.StatusBadRequest)
				return
			}
			go s.broker.relay(req.URL, req.Host)
		default:
			http.Error(w, http.StatusText(http.StatusBadRequest), http.StatusBadRequest)
		}

	// TODO case http.MethodPut: // file uploads

	default:
		http.Error(w, http.StatusText(http.StatusNotFound), http.StatusNotFound)
	}
}

var (
	logSep = []byte(" ")
)

func initSite(site *Site, aofPath string) {
	file, err := os.Open(aofPath)
	if err != nil {
		log.Fatalln("#", "failed opening AOF file:", err)
	}
	defer file.Close()

	startTime := time.Now()
	line, used := 0, 0
	scanner := bufio.NewScanner(file)
	for scanner.Scan() { // FIXME not reliable if line length > 65536 chars
		line++
		data := scanner.Bytes()
		tokens := bytes.SplitN(data, logSep, 4) // "date time marker entry"
		if len(tokens) < 4 {
			log.Println("#", "warning: want (date, time, marker, entry); skipped line", line)
			continue
		}

		marker, entry := tokens[2], tokens[3]
		if len(marker) > 0 {
			mark := marker[0]
			if mark == '#' { // comment
				continue
			}
			tokens = bytes.SplitN(entry, logSep, 2) // "url data"
			if len(tokens) < 2 {
				log.Println("#", "warning: want (url, data); skipped line", line)
				continue
			}
			url, data := tokens[0], tokens[1]
			switch mark {
			case '*': // patch existing page
				site.patch(string(url), data)
				used++
			case '=': // compacted page; overwrite
				site.set(string(url), data)
				used++
			default:
				log.Println("#", "warning: bad marker", marker, "on line", line)
			}
		}
	}

	log.Printf("# init: %d lines read, %d lines used, %s\n", line, used, time.Since(startTime))

	if err := scanner.Err(); err != nil {
		log.Fatalln("#", "failed scanning AOF file:", err)
	}
}

func compactSite(aofPath string) {
	site := newSite()
	initSite(site, aofPath)
	for url, page := range site.pages {
		log.Println("=", url, string(page.marshal()))
	}
}

// ServerConf represents Server configuration options.
type ServerConf struct {
	Listen          string
	WebRoot         string
	AccessKeyID     string
	AccessKeySecret string
	Init            string
	Compact         string
	CertFile        string
	KeyFile         string
}

// Run runs the HTTP server.
func Run(conf ServerConf) {
	accessKeyHash, err := bcrypt.GenerateFromPassword([]byte(conf.AccessKeySecret), bcrypt.DefaultCost)
	if err != nil {
		echo(Log{"t": "users_init", "error": err.Error()})
		return
	}

	// FIXME RBAC
	users := map[string][]byte{conf.AccessKeyID: accessKeyHash}

	if len(conf.Compact) > 0 {
		compactSite(conf.Compact)
		return
	}

	site := newSite()
	if len(conf.Init) > 0 {
		initSite(site, conf.Init)
	}

	hub := newBroker(site)
	go hub.run()

	http.Handle("/ws", newSocketServer(hub))
	http.Handle("/", newWebServer(site, hub, users, conf.WebRoot))

	for _, line := range strings.Split(logo, "\n") {
		log.Println("#", line)
	}

	echo(Log{"t": "listen", "address": conf.Listen, "webroot": conf.WebRoot})

	if conf.CertFile != "" && conf.KeyFile != "" {
		if err := http.ListenAndServeTLS(conf.Listen, conf.CertFile, conf.KeyFile, nil); err != nil {
			echo(Log{"t": "listen_tls", "error": err.Error()})
		}
	} else {
		if err := http.ListenAndServe(conf.Listen, nil); err != nil {
			echo(Log{"t": "listen_no_tls", "error": err.Error()})
		}
	}
}
