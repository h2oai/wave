package telesync

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
	client := newClient(getRemoteAddr(r), "", s.broker, conn) // XXX set username
	go client.flush()
	go client.listen()
}

func getRemoteAddr(r *http.Request) string {
	if addr := r.Header.Get("X-FORWARDED-FOR"); addr != "" { // forwarded via a proxy?
		return addr
	}
	return r.RemoteAddr
}
