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
	"crypto/tls"
	"encoding/json"
	"fmt"
	"io"
	"io/ioutil"
	"log"
	"net/http"
	"path"
	"path/filepath"
	"strings"
)

const logo = `
┌────────────────┐ H2O Wave 
│  ┐┌┐┐┌─┐┌ ┌┌─┐ │ %s %s
│  └┘└┘└─└└─┘└── │ © 2021 H2O.ai, Inc.
└────────────────┘`

// Log represents key-value data for a log message.
type Log map[string]string

func echo(m Log) {
	if j, err := json.Marshal(m); err == nil { // TODO speed up
		log.Println("#", string(j))
	}
}

func handleWithBaseURL(baseURL string) func(string, http.Handler) {
	return func(pattern string, handler http.Handler) {
		http.Handle(baseURL+pattern, handler)
	}
}

func resolveURL(path, baseURL string) string {
	// TODO: Ugly - add leading slash for compatibility.
	// TODO: Strip leading slash in Py/R clients?
	return "/" + strings.TrimPrefix(path, baseURL)
}

func printLaunchBar(addr, baseURL string, isTLS bool) {
	if strings.HasPrefix(addr, ":") {
		addr = "localhost" + addr
	}
	if isTLS {
		addr = "https://" + addr
	} else {
		addr = "http://" + addr
	}
	message := "Running at " + addr + baseURL
	bar := strings.Repeat("─", len(message)+4)
	log.Println("# ┌" + bar + "┐")
	log.Println("# │  " + message + "  │")
	log.Println("# └" + bar + "┘")
}

// Run runs the HTTP server.
func Run(conf ServerConf) {
	for _, line := range strings.Split(fmt.Sprintf(logo, conf.Version, conf.BuildDate), "\n") {
		log.Println("#", line)
	}

	isTLS := conf.CertFile != "" && conf.KeyFile != ""

	printLaunchBar(conf.Listen, conf.BaseURL, isTLS)

	site := newSite()
	if len(conf.Init) > 0 {
		initSite(site, conf.Init)
	}

	handle := handleWithBaseURL(conf.BaseURL)

	broker := newBroker(site, conf.Editable, conf.NoStore, conf.NoLog, conf.KeepAppLive, conf.Debug)
	go broker.run()

	if conf.Debug {
		handle("_d/site", newDebugHandler(broker))
	}

	var auth *Auth

	if conf.Auth != nil {
		var err error
		if auth, err = newAuth(conf.Auth, conf.BaseURL, conf.BaseURL+"_auth/init", conf.BaseURL+"_auth/login"); err != nil {
			panic(fmt.Errorf("failed connecting to OIDC provider: %v", err))
		}
		handle("_auth/init", newLoginHandler(auth))
		handle("_auth/callback", newAuthHandler(auth))
		handle("_auth/logout", newLogoutHandler(auth, broker))
		handle("_auth/refresh", newRefreshHandler(auth, conf.Keychain))
	}

	handle("_s/", newSocketServer(broker, auth, conf.Editable, conf.BaseURL, conf.ForwardedHeaders, conf.PingInterval)) // XXX terminate sockets when logged out

	fileDir := filepath.Join(conf.DataDir, "f")
	handle("_f/", newFileServer(fileDir, conf.Keychain, auth, conf.BaseURL+"_f"))
	for _, dir := range conf.PrivateDirs {
		prefix, src := splitDirMapping(dir)
		echo(Log{"t": "private_dir", "source": src, "address": prefix})
		handle(prefix, http.StripPrefix(conf.BaseURL+prefix, newDirServer(src, conf.Keychain, auth)))
	}
	for _, dir := range conf.PublicDirs {
		prefix, src := splitDirMapping(dir)
		echo(Log{"t": "public_dir", "source": src, "address": prefix})
		handle(prefix, http.StripPrefix(conf.BaseURL+prefix, http.FileServer(http.Dir(src))))
	}

	handle("_c/", newCache(conf.BaseURL+"_c/", conf.Keychain, conf.MaxCacheRequestSize))
	handle("_m/", newMultipartServer(conf.BaseURL+"_m/", conf.Keychain, auth, conf.MaxRequestSize))

	if conf.Proxy {
		handle("_p/", newProxy(auth, conf.MaxProxyRequestSize, conf.MaxProxyResponseSize))
	}

	if conf.IDE {
		ide := http.StripPrefix("_ide", http.FileServer(http.Dir(path.Join(conf.WebDir, "_ide"))))
		handle("_ide", http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			if auth != nil && !auth.allow(r) {
				http.Error(w, http.StatusText(http.StatusUnauthorized), http.StatusUnauthorized)
				return
			}
			ide.ServeHTTP(w, r)
		}))
	}

	webServer, err := newWebServer(site, broker, auth, conf.Keychain, conf.MaxRequestSize, conf.BaseURL, conf.WebDir, conf.Header)
	if err != nil {
		panic(err)
	}
	handle("", webServer)

	echo(Log{"t": "listen", "address": conf.Listen, "web-dir": conf.WebDir, "base-url": conf.BaseURL})

	if conf.SkipCertVerification {
		http.DefaultTransport.(*http.Transport).TLSClientConfig = &tls.Config{InsecureSkipVerify: true}
	}

	if isTLS {
		if err := http.ListenAndServeTLS(conf.Listen, conf.CertFile, conf.KeyFile, nil); err != nil {
			echo(Log{"t": "listen_tls", "error": err.Error()})
		}
	} else {
		if err := http.ListenAndServe(conf.Listen, nil); err != nil {
			echo(Log{"t": "listen_no_tls", "error": err.Error()})
		}
	}
}

func splitDirMapping(m string) (string, string) {
	xs := strings.SplitN(m, "@", 2)
	if len(xs) < 2 {
		panic(fmt.Sprintf("invalid directory mapping: want \"remote@local\", got %s", m))
	}

	// Windows prepends the drive letter to the path with a leading slash, e.g. "/foo/" => "C:/foo/".
	if xs[0][1] == ':' {
		xs[0] = xs[0][2:]
	}

	return strings.TrimLeft(xs[0], "/"), xs[1]
}

func readRequestWithLimit(w http.ResponseWriter, r io.ReadCloser, n int64) ([]byte, error) {
	return ioutil.ReadAll(http.MaxBytesReader(w, r, n))
}

func isRequestTooLarge(err error) bool {
	// HACK: net/http does not export the error
	// https://github.com/golang/go/issues/30715
	// https://github.com/golang/go/issues/41493
	return err != nil && err.Error() == "http: request body too large"
}

func readWithLimit(r io.Reader, n int64) ([]byte, error) {
	return ioutil.ReadAll(io.LimitReader(r, n))
}
