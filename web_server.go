package wave

import (
	"encoding/json"
	"io/ioutil"
	"net/http"
	"net/url"
	"path"

	"golang.org/x/crypto/bcrypt"
)

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

func newWebServer(site *Site, broker *Broker, users map[string][]byte, oidcEnabled bool, sessions *OIDCSessions, www string) *WebServer {
	fs := fallback("/", http.FileServer(http.Dir(www)))
	if oidcEnabled {
		fs = checkSession(sessions, fs)
	}
	return &WebServer{site, broker, fs, users}
}

func checkSession(sessions *OIDCSessions, h http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if len(path.Ext(r.URL.Path)) > 0 || r.URL.Path == "/_login" {
			h.ServeHTTP(w, r)
			return
		}

		u, _ := url.Parse("/_login")
		q := u.Query()
		q.Set("next", r.URL.Path)
		u.RawQuery = q.Encode()

		cookie, err := r.Cookie(oidcSessionKey)
		if err != nil {
			http.Redirect(w, r, u.String(), http.StatusFound)
			return
		}
		sessionID := cookie.Value
		_, ok := sessions.get(sessionID)
		if !ok {
			http.Redirect(w, r, u.String(), http.StatusFound)
			return
		}
		h.ServeHTTP(w, r)
	})
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
			var req AppRequest
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
			if req.RegisterApp != nil {
				q := req.RegisterApp
				s.broker.relay(q.Mode, q.Route, q.Host)
				// Force-reload all browsers listening to this app
				s.broker.reset(q.Route) // TODO allow only in debug mode?
			} else if req.UnregisterApp != nil {
				q := req.UnregisterApp
				s.broker.unrelay(q.Route)
				// Force-reload all browsers listening to this app
				s.broker.reset(q.Route) // TODO allow only in debug mode?
			}
		default:
			http.Error(w, http.StatusText(http.StatusBadRequest), http.StatusBadRequest)
		}

	// TODO case http.MethodPut: // file uploads

	default:
		http.Error(w, http.StatusText(http.StatusNotFound), http.StatusNotFound)
	}
}
