package wave

import (
	"net/http"
)

// SocketServer represents a websocket server.
type SocketServer struct {
	broker   *Broker
	sessions *OIDCSessions
}

func newSocketServer(broker *Broker, sessions *OIDCSessions) *SocketServer {
	return &SocketServer{
		broker,
		sessions,
	}
}

func (s *SocketServer) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		echo(Log{"t": "socket_upgrade", "err": err.Error()})
		return
	}
	username, subject, accessToken := getIdentity(r, s.sessions)
	client := newClient(getRemoteAddr(r), username, subject, accessToken, s.broker, conn)
	go client.flush()
	go client.listen()
}

func getIdentity(r *http.Request, sessions *OIDCSessions) (username, subject, accessToken string) {
	username = "default-user"
	subject = "no-subject"
	accessToken = ""

	cookie, err := r.Cookie(oidcSessionKey)
	if err != nil {
		return
	}
	sessionID := cookie.Value
	session, ok := sessions.get(sessionID)
	if !ok {
		return
	}
	return session.username, session.subject, session.token.AccessToken
}

func getRemoteAddr(r *http.Request) string {
	if addr := r.Header.Get("X-FORWARDED-FOR"); addr != "" { // forwarded via a proxy?
		return addr
	}
	return r.RemoteAddr
}
