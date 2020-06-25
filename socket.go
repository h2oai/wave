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
	client := newClient(s.broker, conn)
	go client.flush()
	go client.listen()
}
