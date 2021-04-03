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
	sessions *Auth
	editable bool
}

func newSocketServer(broker *Broker, sessions *Auth, editable bool) *SocketServer {
	return &SocketServer{
		broker,
		sessions,
		editable,
	}
}

func (s *SocketServer) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		echo(Log{"t": "socket_upgrade", "err": err.Error()})
		return
	}
	user := identifyUser(r, s.sessions)
	client := newClient(getRemoteAddr(r), user, s.broker, conn, s.editable)
	go client.flush()
	go client.listen()
}

var (
	anonymous = &User{
		subject:      "anonymous",
		name:         "anonymous",
		accessToken:  "",
		refreshToken: "",
	}
)

func identifyUser(r *http.Request, sessions *Auth) *User {
	cookie, err := r.Cookie(oidcSessionKey)
	if err != nil {
		return anonymous
	}
	sessionID := cookie.Value
	session, ok := sessions.get(sessionID)
	if !ok {
		return anonymous
	}
	return &User{
		subject:      session.subject,
		name:         session.username,
		accessToken:  session.token.AccessToken,
		refreshToken: session.token.RefreshToken,
	}
}

func getRemoteAddr(r *http.Request) string {
	if addr := r.Header.Get("X-FORWARDED-FOR"); addr != "" { // forwarded via a proxy?
		return addr
	}
	return r.RemoteAddr
}
