package qd

import (
	"net/http"
)

// SocketServer represents a websocket server.
type SocketServer struct {
	broker *Broker
}

func newSocketServer(broker *Broker) *SocketServer {
	return &SocketServer{
		broker,
	}
}

func (s *SocketServer) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		echo(Log{"t": "socket_upgrade", "err": err.Error()})
		return
	}
	client := newClient(getRemoteAddr(r), getUsername(r), s.broker, conn)
	go client.flush()
	go client.listen()
}

func getUsername(r *http.Request) string {
	return "default-user" // XXX set username
}

func getRemoteAddr(r *http.Request) string {
	if addr := r.Header.Get("X-FORWARDED-FOR"); addr != "" { // forwarded via a proxy?
		return addr
	}
	return r.RemoteAddr
}
