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
	"fmt"
	"io"
	"io/ioutil"
	"log"
	"net/http"
	"path/filepath"
	"strings"
	"time"

	"github.com/coreos/go-oidc"
	"golang.org/x/oauth2"
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

	var oauth2Config *oauth2.Config
	sessions := newAuth()

	if conf.OIDCClientID != "" && conf.OIDCClientSecret != "" && conf.OIDCProviderURL != "" && conf.OIDCRedirectURL != "" {
		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()
		provider, err := oidc.NewProvider(ctx, conf.OIDCProviderURL)
		if err != nil {
			panic(fmt.Errorf("failed connecting to OIDC provider: %v", err))
		}

		oauth2Config = &oauth2.Config{
			ClientID:     conf.OIDCClientID,
			ClientSecret: conf.OIDCClientSecret,
			Endpoint:     provider.Endpoint(),
			RedirectURL:  conf.OIDCRedirectURL,
			//TODO: make configurable
			Scopes: []string{oidc.ScopeOpenID},
		}

		http.Handle("/_auth/init", newOIDCInitHandler(sessions, oauth2Config))
		http.Handle("/_auth/callback", newOAuth2Handler(sessions, oauth2Config, conf.OIDCProviderURL))
		http.Handle("/_logout", newOIDCLogoutHandler(sessions, conf.OIDCEndSessionURL))
	}

	http.Handle("/_s", newSocketServer(broker, sessions, conf.Editable)) // XXX secure (ui)
	fileDir := filepath.Join(conf.DataDir, "f")
	http.Handle("/_f", newFileStore(fileDir))                       // XXX secure (ui, api)
	http.Handle("/_f/", newFileServer(fileDir))                     // XXX secure (ui, api)
	http.Handle("/_c/", newCache("/_c/", conf.MaxCacheRequestSize)) // XXX secure (api)
	// TODO enable when IDE is ready for release
	// http.Handle("/_p", newProxy(conf.MaxProxyRequestSize, conf.MaxProxyResponseSize)) // XXX secure (ui)
	// http.Handle("/_ide", http.StripPrefix("/_ide", http.FileServer(http.Dir(path.Join(conf.WebDir, "_ide"))))) // XXX secure
	http.Handle("/", newWebServer(site, broker, conf.Keychain, conf.MaxRequestSize, sessions, oauth2Config, conf.OIDCSkipLogin, conf.WebDir))

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
