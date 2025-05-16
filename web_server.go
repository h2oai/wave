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
	"crypto/rand"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"path"
	"path/filepath"
	"strings"

	"github.com/h2oai/wave/pkg/keychain"
)

// WebServer represents a web server (d'oh).
type WebServer struct {
	site           *Site
	broker         *Broker
	fs             http.Handler
	keychain       *keychain.Keychain
	maxRequestSize int64
	baseURL        string
}

const (
	contentTypeJSON = "application/json"
	contentTypeHTML = "text/html; charset=UTF-8"
)

func newWebServer(
	site *Site,
	broker *Broker,
	auth *Auth,
	keychain *keychain.Keychain,
	maxRequestSize int64,
	baseURL string,
	webDir string,
	header http.Header,
) (*WebServer, error) {

	// read default index.html page from the web root
	indexPage, err := ioutil.ReadFile(filepath.Join(webDir, "index.html"))
	if err != nil {
		return nil, fmt.Errorf("failed reading default index.html page: %v", err)
	}

	nonce, err := generateNonce()
	if err != nil {
		return nil, fmt.Errorf("failed generating nonce: %v", err)
	}

	indexHTML, err := mungeIndexPage(baseURL, string(indexPage), nonce)
	if err != nil {
		return nil, fmt.Errorf("failed munging default index.html page: %v", err)
	}

	cspHeader := header.Get("Content-Security-Policy")
	if cspHeader != "" {
		if strings.Contains(cspHeader, "script-src") {
			cspHeader = strings.ReplaceAll(cspHeader, "script-src", "script-src 'nonce-"+nonce+"'")
		} else {
			cspHeader = cspHeader + "; script-src 'nonce-" + nonce + "'"
		}
		if strings.Contains(cspHeader, "style-src") {
			cspHeader = strings.ReplaceAll(cspHeader, "style-src", "style-src 'nonce-"+nonce+"'")
		} else {
			cspHeader = cspHeader + "; style-src 'nonce-" + nonce + "'"
		}
		header.Set("Content-Security-Policy", cspHeader)
	}

	fs := handleStatic([]byte(indexHTML), http.StripPrefix(baseURL, http.FileServer(http.Dir(webDir))), header)
	if auth != nil {
		fs = auth.wrap(fs)
	}
	return &WebServer{site, broker, fs, keychain, maxRequestSize, baseURL}, nil
}

func generateNonce() (string, error) {
	// Generate a random nonce for Content Security Policy (CSP).
	nonce := make([]byte, 32)
	if _, err := rand.Read(nonce); err != nil {
		return "", fmt.Errorf("failed reading default index.html page: %v", err)
	}
	return base64.StdEncoding.EncodeToString(nonce), nil
}

func mungeIndexPage(baseURL, html, nonce string) (string, error) {
	// HACK: Set base URL as a body tag attribute, to be used by the front-end for deducing hash-routing and websocket addresses.
	html = strings.Replace(html, "<body", `<body data-base-url="`+baseURL+`" data-nonce="`+nonce+`"`, 1)
	// ./wave-static/a/b/c.d -> /base-url/wave-static/a/b/c.d
	html = strings.ReplaceAll(html, `="./wave-static/`, `="`+baseURL+"wave-static/")
	// Add a nonce to initial payload inline script.
	html = strings.ReplaceAll(html, "<script>", `<script nonce="`+nonce+`">`)
	return html, nil
}

func (s *WebServer) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodPatch: // writes
		if !s.keychain.Guard(w, r) {
			return
		}
		s.patch(w, r)
	case http.MethodGet: // reads
		switch r.Header.Get("Content-Type") {
		case contentTypeJSON: // data
			if !s.keychain.Guard(w, r) {
				return
			}
			s.get(w, r)
		default: // static/public assets
			h := s.fs
			if strings.Contains(r.Header.Get("Accept-Encoding"), "gzip") {
				h = serveGzipped(s.fs)
			}
			h.ServeHTTP(w, r)
		}
	case http.MethodPost: // all other APIs
		if !s.keychain.Guard(w, r) {
			return
		}
		s.post(w, r)
	default:
		http.Error(w, http.StatusText(http.StatusMethodNotAllowed), http.StatusMethodNotAllowed)
	}
}

func (s *WebServer) patch(w http.ResponseWriter, r *http.Request) {
	data, err := readRequestWithLimit(w, r.Body, s.maxRequestSize)
	if err != nil {
		echo(Log{"t": "read patch request body", "error": err.Error()})
		if isRequestTooLarge(err) {
			http.Error(w, http.StatusText(http.StatusRequestEntityTooLarge), http.StatusRequestEntityTooLarge)
			return
		}
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}
	s.broker.patch(resolveURL(r.URL.Path, s.baseURL), data)
}

func (s *WebServer) get(w http.ResponseWriter, r *http.Request) {
	url := resolveURL(r.URL.Path, s.baseURL)
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

		b, err := readRequestWithLimit(w, r.Body, s.maxRequestSize)
		if err != nil {
			echo(Log{"t": "read post request body", "error": err.Error()})
			if isRequestTooLarge(err) {
				http.Error(w, http.StatusText(http.StatusRequestEntityTooLarge), http.StatusRequestEntityTooLarge)
				return
			}
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
			s.broker.addApp(q.Mode, q.Route, q.Address, q.KeyID, q.KeySecret)
		} else if req.UnregisterApp != nil {
			q := req.UnregisterApp
			s.broker.dropApp(q.Route)
		}
	default:
		http.Error(w, http.StatusText(http.StatusBadRequest), http.StatusBadRequest)
	}
}

func handleStatic(indexPage []byte, fs http.Handler, extraHeader http.Header) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// if the url has an extension, serve the file
		if len(path.Ext(r.URL.Path)) > 0 {
			fs.ServeHTTP(w, r)
			return
		}

		// url has no extension; assume index.html
		// bypass file server, write index.html containing embedded base URL.

		header := w.Header()
		header.Add("Content-Type", contentTypeHTML)
		header.Add("Cache-Control", "no-cache, must-revalidate")
		header.Add("Pragma", "no-cache")

		copyHeaders(extraHeader, header)

		w.Write(indexPage)
	})
}

func copyHeaders(src, dst http.Header) {
	for k, vs := range src {
		for _, v := range vs {
			dst.Add(k, v)
		}
	}
}
