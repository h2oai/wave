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
	"encoding/json"
	"fmt"
	"io"
	"io/ioutil"
	"log"
	"net/http"
	"path/filepath"
	"strings"
)

const logo = `
┌─────────────────────────┐
│  ┌    ┌ ┌──┐ ┌  ┌ ┌──┐  │ H2O Wave
│  │ ┌──┘ │──│ │  │ └┐    │ %s %s
│  └─┘    ┘  ┘ └──┘  └─┘  │ © 2021 H2O.ai, Inc.
└─────────────────────────┘
`

// Log represents key-value data for a log message.
type Log map[string]string

func echo(m Log) {
	if j, err := json.Marshal(m); err == nil { // TODO speed up
		log.Println("#", string(j))
	}
}

// Run runs the HTTP server.
func Run(conf ServerConf) {
	site := newSite()
	if len(conf.Init) > 0 {
		initSite(site, conf.Init)
	}

	broker := newBroker(site)
	go broker.run()

	if conf.Debug {
		http.Handle("/_d/site", newDebugHandler(broker))
	}

	var auth *Auth

	if conf.Auth != nil {
		var err error
		if auth, err = newAuth(conf.Auth); err != nil {
			panic(fmt.Errorf("failed connecting to OIDC provider: %v", err))
		}
		http.Handle("/_auth/init", newLoginHandler(auth))
		http.Handle("/_auth/callback", newAuthHandler(auth))
		http.Handle("/_auth/logout", newLogoutHandler(auth))
	}

	http.Handle("/_s", newSocketServer(broker, auth, conf.Editable)) // XXX secure (ui)
	fileDir := filepath.Join(conf.DataDir, "f")
	http.Handle("/_f", newFileStore(fileDir, conf.Keychain, auth))
	http.Handle("/_f/", newFileServer(fileDir, conf.Keychain, auth))
	http.Handle("/_c/", newCache("/_c/", conf.Keychain, conf.MaxCacheRequestSize))
	if conf.Proxy {
		http.Handle("/_p", newProxy(auth, conf.MaxProxyRequestSize, conf.MaxProxyResponseSize))
	}
	// TODO enable when IDE is ready for release
	// http.Handle("/_ide", http.StripPrefix("/_ide", http.FileServer(http.Dir(path.Join(conf.WebDir, "_ide"))))) // XXX secure (ui)
	http.Handle("/", newWebServer(site, broker, auth, conf.Keychain, conf.MaxRequestSize, conf.WebDir))

	for _, line := range strings.Split(fmt.Sprintf(logo, conf.Version, conf.BuildDate), "\n") {
		log.Println("#", line)
	}

	echo(Log{"t": "listen", "address": conf.Listen, "webroot": conf.WebDir})

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

func readRequestWithLimit(w http.ResponseWriter, r io.ReadCloser, n int64) ([]byte, error) {
	return ioutil.ReadAll(http.MaxBytesReader(w, r, n))
}

func readWithLimit(r io.Reader, n int64) ([]byte, error) {
	return ioutil.ReadAll(io.LimitReader(r, n))
}
