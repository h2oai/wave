package telesync

import (
	"time"

	"github.com/gorilla/websocket"
)

const (
	// Time allowed to write a message to the peer.
	writeWait = 10 * time.Second

	// Time allowed to read the next pong message from the peer.
	pongWait = 60 * time.Second

	// Send pings to peer with this period. Must be less than pongWait.
	pingPeriod = (pongWait * 9) / 10

	// Maximum message size allowed from peer.
	maxMessageSize = 512
)

var (
	newline  = []byte{'\n'}
	notFound = []byte(`{"e":"not_found"}`)
	upgrader = websocket.Upgrader{
		ReadBufferSize:  1024,
		WriteBufferSize: 1024,
	}
)

// Client represent a websocket (UI) client.
type Client struct {
	broker *Broker         // broker
	conn   *websocket.Conn // connection
	addr   string          // remote host:port
	urls   []string        // watched page urls
	send   chan []byte     // send data
}

func newClient(broker *Broker, conn *websocket.Conn, addr string) *Client {
	return &Client{broker, conn, addr, nil, make(chan []byte, 256)}
}

func (c *Client) listen() {
	defer func() {
		c.broker.unsubscribe <- c
		c.conn.Close()
	}()
	c.conn.SetReadLimit(maxMessageSize)
	c.conn.SetReadDeadline(time.Now().Add(pongWait))
	c.conn.SetPongHandler(func(string) error {
		c.conn.SetReadDeadline(time.Now().Add(pongWait))
		return nil
	})
	for {
		_, msg, err := c.conn.ReadMessage()
		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				echo(Log{"t": "socket_read", "err": err.Error()})
			}
			break
		}

		m := parseMsg(msg)
		switch m.t {
		case patchMsgT:
			c.broker.patch(m.addr, m.data)
		case routeMsgT:
			c.broker.route(m.addr, m.data)
		case watchMsgT:
			page := c.broker.site.at(m.addr)
			if page == nil {
				if relay := c.broker.at(m.addr); relay != nil {
					c.subscribe(m.addr) // XXX subscribe using client address
					relay.relay(boot)
					continue
				}
			}

			c.subscribe(m.addr)

			if page == nil {
				c.route(notFound)
				continue
			}

			data := page.marshal()
			if data == nil {
				c.route(notFound)
				continue
			}

			c.route(data)
		}
	}
}

func (c *Client) subscribe(url string) {
	c.urls = append(c.urls, url) // TODO review
	c.broker.subscribe <- Sub{url, c}
}

func (c *Client) route(data []byte) bool {
	select {
	case c.send <- data:
		return true
	default:
		return false
	}
}

func (c *Client) flush() {
	ticker := time.NewTicker(pingPeriod)
	defer func() {
		ticker.Stop()
		c.conn.Close()
	}()
	for {
		select {
		case message, ok := <-c.send:
			c.conn.SetWriteDeadline(time.Now().Add(writeWait))
			if !ok {
				// broker closed the channel.
				c.conn.WriteMessage(websocket.CloseMessage, []byte{})
				return
			}

			w, err := c.conn.NextWriter(websocket.TextMessage)
			if err != nil {
				return
			}
			w.Write(message)

			// push queued messages, if any
			n := len(c.send)
			for i := 0; i < n; i++ {
				w.Write(newline)
				w.Write(<-c.send)
			}

			if err := w.Close(); err != nil {
				return
			}
		case <-ticker.C:
			c.conn.SetWriteDeadline(time.Now().Add(writeWait))
			if err := c.conn.WriteMessage(websocket.PingMessage, nil); err != nil {
				return
			}
		}
	}
}

func (c *Client) quit() {
	close(c.send)
}
