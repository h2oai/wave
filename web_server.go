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

package wave

import (
	"context"
	"encoding/json"
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
	oidcEnabled bool,
	sessions *OIDCSessions,
	oauth2Config oauth2.Config,
	www string,
) *WebServer {
	fs := fallback("/", http.FileServer(http.Dir(www)))
	if oidcEnabled {
		fs = checkSession(oauth2Config, sessions, fs)
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

func checkSession(oauth2Config oauth2.Config, sessions *OIDCSessions, h http.Handler) http.Handler {
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
