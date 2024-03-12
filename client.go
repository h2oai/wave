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
	"net/http"
	"sync"
	"time"

	"github.com/google/uuid"
	"github.com/gorilla/websocket"
)

const (
	// Time allowed to write a message to the peer.
	writeWait = 10 * time.Second

	// Maximum message size allowed from peer.
	maxMessageSize = 1 * 1024 * 1024 // bytes
)

var (
	newline          = []byte{'\n'}
	notFoundMsg      = []byte(`{"e":"not_found"}`)
	disconnectMsg    = []byte(`{"data": {"":{"@system":{"client_disconnect":true}}}}`)
	clearStateMsg    = []byte(`{"c":1}`)
	STATE_CREATED    = "CREATED"
	STATE_TIMEOUT    = "TIMEOUT"
	STATE_LISTEN     = "LISTEN"
	STATE_RECONNECT  = "RECONNECT"
	STATE_DISCONNECT = "DISCONNECT"
	STATE_CLOSED     = "CLOSED"
)

// BootMsg represents the initial message sent to an app when a client first connects to it.
type BootMsg struct {
	Data struct {
		Hash           string `json:"#,omitempty"`                        // location hash
		SubmissionName string `json:"__wave_submission_name__,omitempty"` // mark the cause of the serve invocation
	} `json:"data"`
	Headers http.Header `json:"headers"` // forwarded headers
}

// Client represent a websocket (UI) client.
type Client struct {
	id               string          // unique id
	auth             *Auth           // auth provider, might be nil
	addr             string          // remote IP:port, used for logging only
	session          *Session        // end-user session
	broker           *Broker         // broker
	conn             *websocket.Conn // connection
	routes           []string        // watched routes
	data             chan []byte     // send data
	editable         bool            // allow editing? // TODO move to user; tie to role
	baseURL          string          // URL prefix of the Wave server
	header           *http.Header    // forwarded headers from the WS connection
	appPath          string          // path of the app this client is connected to, doesn't change throughout WS lifetime
	pingInterval     time.Duration
	reconnectTimeout time.Duration
	lock             *sync.Mutex
	state            string
}

// TODO: Refactor some of the params into a Config struct.
func newClient(addr string, auth *Auth, session *Session, broker *Broker, conn *websocket.Conn, editable bool,
	baseURL string, header *http.Header, pingInterval time.Duration, reconnectTimeout time.Duration) *Client {
	id := uuid.New().String()
	return &Client{id, auth, addr, session, broker, conn, nil, make(chan []byte, 256),
		editable, baseURL, header, "", pingInterval, reconnectTimeout, &sync.Mutex{}, STATE_CREATED}
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

func (c *Client) setState(newState string) {
	c.lock.Lock()
	c.state = newState
	c.lock.Unlock()
}

func (c *Client) listen() {
	defer func() {
		c.lock.Lock()
		defer c.lock.Unlock()
		if c.state != STATE_DISCONNECT {
			return
		}
		// This defer runs to completion. If the client drops, reconnects and drops out again, ignore first drop timeout.
		timeoutID := STATE_TIMEOUT + c.addr
		c.state = timeoutID
		c.lock.Unlock()

		select {
		// Send disconnect message only if client doesn't reconnect within the specified timeframe.
		case <-time.After(c.reconnectTimeout):
			c.lock.Lock()
			if c.state != timeoutID {
				return
			}
			app := c.broker.getApp(c.appPath)
			if app != nil {
				app.forward(c.id, c.session, disconnectMsg)
				if err := app.disconnect(c.id); err != nil {
					echo(Log{"t": "disconnect", "client": c.addr, "route": c.appPath, "err": err.Error()})
				}
			}

			echo(Log{"t": "client_unsubscribe", "client": c.id, "state": c.state})
			c.broker.unsubscribe <- c
			c.state = STATE_CLOSED
			return
		}
	}()
	// Time allowed to read the next pong message from the peer. Must be greater than ping interval.
	pongWait := 10 * c.pingInterval / 9
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
			c.setState(STATE_DISCONNECT)
			break
		}

		if err := c.refreshToken(); err != nil {
			// token refresh failed, this is not fatal err, try next time
			// TODO kick user out?
			echo(Log{"t": "refresh_oauth2_token", "client": c.addr, "err": err.Error()})
		}

		if c.session != nil && c.auth != nil {
			if err := c.session.touch(c.auth.conf.InactivityTimeout); err != nil {
				if msg, err := json.Marshal(OpsD{U: c.baseURL + "_auth/logout"}); err == nil {
					c.send(msg)
				}
				continue
			}
		}

		m := parseMsg(msg)
		m.addr = resolveURL(m.addr, c.baseURL)
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

			app.forward(c.id, c.session, []byte("{\"data\":"+string(m.data)+"}"))

			// Remove any dirty UI state if broadcast or multicast.
			if app.mode == multicastMode {
				c.broker.sendAll(c.broker.clients["/"+c.session.subject], clearStateMsg)
			}
			if app.mode == broadcastMode {
				c.broker.sendAll(c.broker.clients[app.route], clearStateMsg)
			}
		case watchMsgT:
			c.lock.Lock()
			state := c.state
			c.lock.Unlock()
			if state == STATE_RECONNECT {
				continue
			}
			c.subscribe(m.addr)                             // subscribe even if page is currently NA
			if app := c.broker.getApp(m.addr); app != nil { // do we have an app handling this route?
				c.appPath = m.addr
				switch app.mode {
				case unicastMode:
					c.subscribe("/" + c.id) // client-level
				case multicastMode:
					c.subscribe("/" + c.session.subject) // user-level
				}

				boot := BootMsg{Headers: *c.header}

				if len(m.data) > 0 { // location hash
					boot.Data.Hash = string(m.data)
					boot.Data.SubmissionName = "#"
				}

				body, err := json.Marshal(boot)
				if err != nil {
					echo(Log{"t": "watch", "client": c.addr, "route": m.addr, "error": "failed marshaling body"})
					continue
				}

				app.forward(c.id, c.session, body)
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

			c.send(notFoundMsg)
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
	ticker := time.NewTicker(c.pingInterval)
	defer func() {
		ticker.Stop()
		c.conn.Close()
		c.lock.Unlock()
	}()
	for {
		select {
		case data, ok := <-c.data:
			// An alternative to the mutex here would be a new channel for closing the connection so it does not race with reconnect.
			c.lock.Lock()
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
			c.lock.Unlock()
		case <-ticker.C:
			c.lock.Lock()
			c.conn.SetWriteDeadline(time.Now().Add(writeWait))
			if err := c.conn.WriteMessage(websocket.PingMessage, nil); err != nil {
				return
			}
			c.lock.Unlock()
		}
	}
}

func (c *Client) quit() {
	close(c.data)
}
