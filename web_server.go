package wave

import (
	"context"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"net/url"
	"path"

	"golang.org/x/crypto/bcrypt"
	"golang.org/x/oauth2"
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

func newWebServer(
	site *Site,
	broker *Broker,
	users map[string][]byte,
	conf ServerConf,
	sessions *OIDCSessions,
	oauth2Config oauth2.Config,
	www string,
) *WebServer {
	fs := fallback("/", http.FileServer(http.Dir(www)))
	if conf.oidcEnabled() {
		fs = checkSession(conf, oauth2Config, sessions, fs)
	}
	return &WebServer{site, broker, fs, users}
}

func (s *WebServer) authenticate(username, password string) bool {
	hash, ok := s.users[username]
	if !ok {
		return false
	}
	err := bcrypt.CompareHashAndPassword(hash, []byte(password))
	return err == nil
}

func (s *WebServer) guard(w http.ResponseWriter, r *http.Request) bool {
	username, password, ok := r.BasicAuth()
	if !ok || !s.authenticate(username, password) {
		http.Error(w, http.StatusText(http.StatusUnauthorized), http.StatusUnauthorized)
		return false
	}
	return true
}

func (s *WebServer) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodPatch: // writes
		if !s.guard(w, r) {
			return
		}
		s.patch(w, r)
	case http.MethodGet: // reads
		switch r.Header.Get("Content-Type") {
		case contentTypeJSON: // data
			s.get(w, r)
		default: // template
			s.fs.ServeHTTP(w, r)
		}
	case http.MethodPost: // all other APIs
		if !s.guard(w, r) {
			return
		}
		s.post(w, r)
	// TODO case http.MethodPut: // file uploads
	default:
		http.Error(w, http.StatusText(http.StatusNotFound), http.StatusNotFound)
	}
}

func (s *WebServer) patch(w http.ResponseWriter, r *http.Request) {
	data, err := ioutil.ReadAll(r.Body) // XXX add limit
	if err != nil {
		echo(Log{"t": "read patch request body", "error": err.Error()})
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}
	s.broker.patch(r.URL.Path, data)
}

func (s *WebServer) get(w http.ResponseWriter, r *http.Request) {
	url := r.URL.Path
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
}

func (s *WebServer) post(w http.ResponseWriter, r *http.Request) {
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
			s.broker.addApp(q.Mode, q.Route, q.Address)
		} else if req.UnregisterApp != nil {
			q := req.UnregisterApp
			s.broker.dropApp(q.Route)
		}
	default:
		http.Error(w, http.StatusText(http.StatusBadRequest), http.StatusBadRequest)
	}
}

func checkSession(conf ServerConf, oauth2Config oauth2.Config, sessions *OIDCSessions, h http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if len(path.Ext(r.URL.Path)) > 0 {
			h.ServeHTTP(w, r)
			return
		}
		if r.URL.Path == "/_login" {
			if conf.OIDCSkipLoginPage {
				u, _ := url.Parse("/_auth/init")
				if r.URL.Query().Get("next") != "" {
					q := map[string]string{"next": r.URL.Query().Get("next")}
					u, _ = urlWithQuery("/_auth/init", q)
				}
				http.Redirect(w, r, u.String(), http.StatusFound)
				return
			}
			h.ServeHTTP(w, r)
			return
		}

		q := map[string]string{"next": r.URL.Path}
		u, _ := urlWithQuery("/_login", q)

		cookie, err := r.Cookie(oidcSessionKey)
		if err != nil {
			http.Redirect(w, r, u.String(), http.StatusFound)
			return
		}
		sessionID := cookie.Value
		session, ok := sessions.get(sessionID)
		if !ok {
			http.Redirect(w, r, u.String(), http.StatusFound)
			return
		}

		t, err := ensureValidOidcToken(r.Context(), oauth2Config, session.token)
		if err != nil {
			echo(Log{"t": "access_token_refresh", "error": err.Error()})
			http.Redirect(w, r, u.String(), http.StatusFound)
			return
		}
		if session.token != t {
			session.token = t
			sessions.set(sessionID, session)
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

func ensureValidOidcToken(c context.Context, cfg oauth2.Config, t *oauth2.Token) (*oauth2.Token, error) {
	return cfg.TokenSource(c, t).Token()
}

func urlWithQuery(b string, p map[string]string) (*url.URL, error) {
	u, err := url.Parse(b)
	if err != nil {
		return nil, fmt.Errorf("failed parsing base url: %v", err)
	}
	q := u.Query()
	for k, v := range p {
		q.Set(k, v)
	}
	u.RawQuery = q.Encode()
	return u, nil
}
