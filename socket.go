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
	"net/http"
)

// SocketServer represents a websocket server.
type SocketServer struct {
	broker   *Broker
	auth     *Auth
	editable bool
}

func newSocketServer(broker *Broker, auth *Auth, editable bool) *SocketServer {
	return &SocketServer{
		broker,
		auth,
		editable,
	}
}

func (s *SocketServer) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	user := anonymous
	if s.auth != nil {
		user = s.auth.identify(r)
		if user == nil {
			http.Error(w, http.StatusText(http.StatusUnauthorized), http.StatusUnauthorized)
			return
		}
	}

	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		echo(Log{"t": "socket_upgrade", "err": err.Error()})
		return
	}

	client := newClient(getRemoteAddr(r), s.auth, user, s.broker, conn, s.editable)
	go client.flush()
	go client.listen()
}

func getRemoteAddr(r *http.Request) string {
	if addr := r.Header.Get("X-FORWARDED-FOR"); addr != "" { // forwarded via a proxy?
		return addr
	}
	return r.RemoteAddr
}
