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
	"context"
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
	auth     *Auth           // auth provider, might be nil
	addr     string          // remote IP:port, used for logging only
	session  *Session        // end-user session
	broker   *Broker         // broker
	conn     *websocket.Conn // connection
	routes   []string        // watched routes
	data     chan []byte     // send data
	editable bool            // allow editing? // TODO move to user; tie to role
}

func newClient(addr string, auth *Auth, session *Session, broker *Broker, conn *websocket.Conn, editable bool) *Client {
	return &Client{uuid.New().String(), auth, addr, session, broker, conn, nil, make(chan []byte, 256), editable}
}

func (c *Client) refreshToken() error {
	if c.auth != nil && c.session.token != nil {
		// TODO: use more meaningful context, e.g. context of current message
		ctx, cancel := context.WithTimeout(context.TODO(), 10*time.Second)
		defer cancel()

		token, err := c.auth.ensureValidOAuth2Token(ctx, c.session.token)
		if err != nil {
			return err
		}
		c.session.token = token
	}
	return nil
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

		if err := c.refreshToken(); err != nil {
			// token refresh failed, this is not fatal err, try next time
			// TODO kick user out?
			echo(Log{"t": "refresh_oauth2_token", "client": c.addr, "err": err.Error()})
		}

		m := parseMsg(msg)
		switch m.t {
		case patchMsgT:
			if c.editable { // allow only if editing is enabled
				c.broker.patch(m.addr, m.data)
			}
		case queryMsgT:
			app := c.broker.getApp(m.addr)
			if app == nil {
				echo(Log{"t": "query", "client": c.addr, "route": m.addr, "error": "service unavailable"})
				continue
			}
			app.forward(c.id, c.session, m.data)
		case watchMsgT:
			c.subscribe(m.addr) // subscribe even if page is currently NA

			if app := c.broker.getApp(m.addr); app != nil { // do we have an app handling this route?
				switch app.mode {
				case unicastMode:
					c.subscribe("/" + c.id) // client-level
				case multicastMode:
					c.subscribe("/" + c.session.subject) // user-level
				}

				boot := emptyJSON
				if len(m.data) > 0 { // location hash
					if j, err := json.Marshal(Boot{Hash: string(m.data)}); err == nil {
						boot = j
					}
				}

				app.forward(c.id, c.session, boot)
				continue
			}

			if headers, err := json.Marshal(OpsD{M: &Meta{Username: c.session.username, Editor: c.editable}}); err == nil {
				c.send(headers)
			}

			if page := c.broker.site.at(m.addr); page != nil { // is page?
				if data := page.marshal(); data != nil {
					c.send(data)
					continue
				}
			}

			c.send(notFound)
		}
	}
}

func (c *Client) subscribe(route string) {
	c.routes = append(c.routes, route)
	c.broker.subscribe <- Sub{route, c}
}

func (c *Client) send(data []byte) bool {
	select {
	case c.data <- data:
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
		case data, ok := <-c.data:
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
			w.Write(data)

			// push queued messages, if any
			n := len(c.data)
			for i := 0; i < n; i++ {
				w.Write(newline)
				w.Write(<-c.data)
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
	close(c.data)
}
