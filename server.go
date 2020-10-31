package wave

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"path/filepath"
	"strings"

	"golang.org/x/crypto/bcrypt"
)

const logo = `
┌─────────────────────────┐
│  ┌    ┌ ┌──┐ ┌  ┌ ┌──┐  │ H2O Wave
│  │ ┌──┘ │──│ │  │ └┐    │ %s %s
│  └─┘    ┘  ┘ └──┘  └─┘  │ © 2020 H2O.ai, Inc.
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
	accessKeyHash, err := bcrypt.GenerateFromPassword([]byte(conf.AccessKeySecret), bcrypt.DefaultCost)
	if err != nil {
		echo(Log{"t": "users_init", "error": err.Error()})
		return
	}

	// FIXME RBAC
	users := map[string][]byte{conf.AccessKeyID: accessKeyHash}

	// FIXME SESSIONS
	sessions := newOIDCSessions()

	if len(conf.Compact) > 0 {
		compactSite(conf.Compact)
		return
	}

	site := newSite()
	if len(conf.Init) > 0 {
		initSite(site, conf.Init)
	}

	broker := newBroker(site)
	go broker.run()

	if conf.Debug {
		http.Handle("/_d/site", newDebugHandler(broker))
	}

	if conf.oidcEnabled() {
		http.Handle("/_auth/init", newOIDCInitHandler(sessions, conf.OIDCClientID, conf.OIDCClientSecret, conf.OIDCProviderURL, conf.OIDCRedirectURL))
		http.Handle("/_auth/callback", newOAuth2Handler(sessions, conf.OIDCClientID, conf.OIDCClientSecret, conf.OIDCProviderURL, conf.OIDCRedirectURL))
		http.Handle("/_logout", newOIDCLogoutHandler(sessions, conf.OIDCEndSessionURL))
	}

	http.Handle("/_s", newSocketServer(broker, sessions))
	fileDir := filepath.Join(conf.DataDir, "f")
	http.Handle("/_f", newFileStore(fileDir))   // XXX secure
	http.Handle("/_f/", newFileServer(fileDir)) // XXX secure
	http.Handle("/_p", newProxy())              // XXX secure
	http.Handle("/", newWebServer(site, broker, users, conf.oidcEnabled(), sessions, conf.WebDir))

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
