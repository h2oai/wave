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
	"net/http"
	"strings"
	"time"

	"github.com/gorilla/websocket"
)

// SocketServer represents a websocket server.
type SocketServer struct {
	broker           *Broker
	auth             *Auth
	editable         bool
	baseURL          string
	forwardedHeaders map[string]bool
	pingInterval     time.Duration
	reconnectTimeout time.Duration
	upgrader         websocket.Upgrader
}

func newSocketServer(broker *Broker, auth *Auth, conf ServerConf) *SocketServer {
	var checkOrigin func(*http.Request) bool
	if conf.AllowedOrigins != nil {
		checkOrigin = func(r *http.Request) bool {
			return conf.AllowedOrigins[r.Header.Get("Origin")]
		}
	}
	upgrader := websocket.Upgrader{
		ReadBufferSize:  1024, // TODO review
		WriteBufferSize: 1024, // TODO review
		CheckOrigin:     checkOrigin,
	}
	return &SocketServer{broker, auth, conf.Editable, conf.BaseURL, conf.ForwardedHeaders, conf.PingInterval, conf.ReconnectTimeout, upgrader}
}

func (s *SocketServer) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	conn, err := s.upgrader.Upgrade(w, r, nil)
	if err != nil {
		echo(Log{"t": "socket_upgrade", "err": err.Error()})
		return
	}

	session := anonymous
	if s.auth != nil {
		session = s.auth.identify(r)
		if session == nil {
			// As per websocket spec, clients are not required to follow HTTP redirects. So we send a redirect message.
			if msg, err := json.Marshal(OpsD{U: s.baseURL + "_auth/logout"}); err == nil {
				sw, err := conn.NextWriter(websocket.TextMessage)
				if err != nil {
					http.Error(w, http.StatusText(http.StatusUnauthorized), http.StatusUnauthorized)
					return
				}
				sw.Write(msg)
				sw.Close()
			}
			return
		}
	}

	header := make(http.Header)
	if s.forwardedHeaders != nil {
		for k, v := range r.Header {
			if s.forwardedHeaders["*"] || s.forwardedHeaders[strings.ToLower(k)] {
				header[k] = v
			}
		}
	}
	clientID := r.URL.Query().Get("client-id")
	client, ok := s.broker.clientsByID[clientID]
	if ok {
		client.conn = conn
		client.isReconnect = true
		if client.cancel != nil {
			client.cancel()
		}
		if s.broker.debug {
			echo(Log{"t": "socket_reconnect", "client_id": clientID, "addr": getRemoteAddr(r)})
		}
	} else {
		client = newClient(getRemoteAddr(r), s.auth, session, s.broker, conn, s.editable, s.baseURL, &header, s.pingInterval, false, s.reconnectTimeout)
	}

	if msg, err := json.Marshal(OpsD{I: client.id}); err == nil {
		sw, err := conn.NextWriter(websocket.TextMessage)
		if err != nil {
			http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
			return
		}
		sw.Write(msg)
		sw.Close()
	}

	go client.flush()
	go client.listen()
}

func getRemoteAddr(r *http.Request) string {
	if addr := r.Header.Get("X-FORWARDED-FOR"); addr != "" { // forwarded via a proxy?
		return addr
	}
	return r.RemoteAddr
}
