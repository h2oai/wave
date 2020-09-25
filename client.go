package qd

import (
	"bytes"
	"encoding/json"
	"time"

	"github.com/google/uuid"
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
	maxMessageSize = 1 * 1024 * 1024 // bytes
)

var (
	newline  = []byte{'\n'}
	notFound = []byte(`{"e":"not_found"}`)
	upgrader = websocket.Upgrader{
		ReadBufferSize:  1024, // TODO review
		WriteBufferSize: 1024, // TODO review
	}
)

// Client represent a websocket (UI) client.
type Client struct {
	id       string          // unique id
	addr     string          // remote address
	username string          // username, or blank
	broker   *Broker         // broker
	conn     *websocket.Conn // connection
	urls     []string        // watched page urls
	send     chan []byte     // send data
}

func newClient(addr, username string, broker *Broker, conn *websocket.Conn) *Client {
	return &Client{uuid.New().String(), addr, username, broker, conn, nil, make(chan []byte, 256)}
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
				echo(Log{"t": "socket_read", "client": c.addr, "err": err.Error()})
			}
			break
		}

		m := parseMsg(msg)
		switch m.t {
		case patchMsgT:
			c.broker.patch(m.addr, m.data)
		case relayMsgT:
			relay := c.broker.at(m.addr)
			if relay == nil {
				echo(Log{"t": "relay", "client": c.addr, "route": m.addr, "error": "service unavailable"})
				continue
			}
			relay.relay(c.format(m.data))
		case watchMsgT:
			if relay := c.broker.at(m.addr); relay != nil { // is service?
				switch relay.mode {
				case unicastMode:
					c.subscribe(c.id) // client-level
				case multicastMode:
					c.subscribe(c.username) // user-level
				case broadcastMode:
					c.subscribe(m.addr) // system-level
				}

				boot := emptyJSON
				if len(m.data) > 0 { // location hash
					if j, err := json.Marshal(Boot{Hash: string(m.data)}); err == nil {
						boot = j
					}
				}
				relay.relay(c.format(boot))
				continue
			}

			c.subscribe(m.addr) // subscribe even if page is currently NA

			if page := c.broker.site.at(m.addr); page != nil { // is page?
				if data := page.marshal(); data != nil {
					c.relay(data)
					continue
				}
			}

			c.relay(notFound)
		}
	}
}

func (c *Client) subscribe(url string) {
	c.urls = append(c.urls, url) // TODO review
	c.broker.subscribe <- Sub{url, c}
}

func (c *Client) relay(data []byte) bool {
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

var (
	usernameHeader = []byte("u:")
	clientIDHeader = []byte("c:")
	relayBodySep   = []byte("\n\n")
)

func (c *Client) format(data []byte) []byte {
	var buf bytes.Buffer

	buf.Write(usernameHeader)
	buf.WriteString(c.username)
	buf.WriteByte('\n')

	buf.Write(clientIDHeader)
	buf.WriteString(c.id)
	buf.Write(relayBodySep)

	buf.Write(data)

	return buf.Bytes()
}
