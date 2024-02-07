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
	"bytes"
	"encoding/json"
	"log"
	"sort"
	"sync"
)

// MsgT represents message types.
type MsgT int

const (
	badMsgT MsgT = iota
	noopMsgT
	patchMsgT
	queryMsgT
	watchMsgT
)

// Msg represents a message.
type Msg struct {
	t    MsgT
	addr string
	data []byte
}

var (
	msgSep     = []byte{' '}
	emptyJSON  = []byte("{}")
	resetMsg   []byte
	invalidMsg = Msg{t: badMsgT}
	logoutMsg  = []byte(`{"data": {"":{"@system":{"logout":true}}}}`)
)

// Pub represents a published message
type Pub struct {
	route string
	data  []byte
}

// Sub represents a subscription.
type Sub struct {
	route  string
	client *Client
}

// Broker represents a message broker.
type Broker struct {
	site        *Site
	editable    bool
	noStore     bool
	noLog       bool
	debug       bool
	clients     map[string]map[*Client]interface{} // route => client-set
	publish     chan Pub
	subscribe   chan Sub
	unsubscribe chan *Client
	logout      chan Pub
	apps        map[string]*App // route => app
	appsMux     sync.RWMutex    // mutex for tracking apps
	unicasts    map[string]bool // "/client_id" => true
	unicastsMux sync.RWMutex    // mutex for tracking unicast routes
	keepAppLive bool
	clientsByID map[string]*Client
}

func newBroker(site *Site, editable, noStore, noLog, keepAppLive, debug bool) *Broker {
	return &Broker{
		site,
		editable,
		noStore,
		noLog,
		debug,
		make(map[string]map[*Client]interface{}),
		make(chan Pub, 1024),     // TODO tune
		make(chan Sub, 1024),     // TODO tune
		make(chan *Client, 1024), // TODO tune
		make(chan Pub, 1024),     // TODO tune
		make(map[string]*App),
		sync.RWMutex{},
		make(map[string]bool),
		sync.RWMutex{},
		keepAppLive,
		make(map[string]*Client),
	}
}

func (b *Broker) addApp(mode, route, addr, keyID, keySecret string) {
	s := newApp(b, mode, route, addr, keyID, keySecret)

	b.appsMux.Lock()
	b.apps[route] = s
	b.appsMux.Unlock()

	echo(Log{"t": "app_add", "route": route, "host": addr})

	// Force-reload all browsers listening to this app
	b.resetSubscribers(route)
}

func (b *Broker) getApp(route string) *App {
	b.appsMux.RLock()
	defer b.appsMux.RUnlock()
	return b.apps[route]
}

func (b *Broker) getApps() []*App {
	b.appsMux.RLock()
	defer b.appsMux.RUnlock()
	var apps []*App
	for _, app := range b.apps {
		apps = append(apps, app)
	}
	return apps
}

func (b *Broker) dropApp(route string) {
	b.appsMux.Lock()
	delete(b.apps, route)
	b.appsMux.Unlock()

	echo(Log{"t": "app_drop", "route": route})

	// Force-reload all browsers listening to this app
	b.resetSubscribers(route)
}

func parseMsgT(s []byte) MsgT {
	if len(s) == 1 {
		switch s[0] {
		case '*':
			return patchMsgT
		case '@':
			return queryMsgT
		case '+':
			return watchMsgT
		case '#':
			return noopMsgT
		}
	}
	return badMsgT
}

func parseMsg(s []byte) Msg {
	// protocol: t<sep>addr<sep>data
	parts := bytes.SplitN(s, msgSep, 3)
	if len(parts) == 3 {
		t, addr, data := parts[0], parts[1], parts[2]
		action := parseMsgT(t)
		if action == badMsgT {
			return invalidMsg
		}
		return Msg{action, string(addr), data}
	}
	return invalidMsg
}

func (b *Broker) isUnicast(route string) bool {
	b.unicastsMux.RLock()
	defer b.unicastsMux.RUnlock()
	_, ok := b.unicasts[route]
	return ok
}

// patch broadcasts changes to clients and patches site data.
func (b *Broker) patch(route string, data []byte) {
	b.publish <- Pub{route, data}

	if !b.noLog {
		// Write AOF entry with patch marker "*" as-is to log file.
		// FIXME bufio.Scanner.Scan() is not reliable if line length > 65536 chars,
		// so reading back in is unreliable.
		log.Println("*", route, string(data))
	}

	// Skip writes if storage is disabled or unicast apps without -editable
	if b.noStore || (!b.editable && b.isUnicast(route)) {
		return
	}

	if err := b.site.patch(route, data); err != nil {
		echo(Log{"t": "broker_patch", "error": err.Error()})
	}
}

func init() {
	var err error
	if resetMsg, err = json.Marshal(OpsD{R: 1}); err != nil {
		panic("failed marshaling reset message")
	}
}

func (b *Broker) resetSubscribers(route string) {
	b.publish <- Pub{route, resetMsg}
}

func (b *Broker) resetClients(session *Session) {
	b.logout <- Pub{session.subject, resetMsg}
	apps := b.getApps()
	for _, app := range apps {
		go func(app *App) {
			app.forward("", session, logoutMsg)
		}(app)
	}
}

// run starts i/o between the broker and clients.
func (b *Broker) run() {
	for {
		select {
		case sub := <-b.subscribe:
			b.addClient(sub.route, sub.client)
		case client := <-b.unsubscribe:
			b.dropClient(client)
		case pub := <-b.publish:
			if clients, ok := b.clients[pub.route]; ok {
				b.sendAll(clients, pub.data)
			}
		case pub := <-b.logout:
			targets := make(map[*Client]interface{})
			// TODO speed up using another map?
			for _, clients := range b.clients {
				for client := range clients {
					if client.session.subject == pub.route {
						targets[client] = nil
					}
				}
			}
			b.sendAll(targets, pub.data)
		}
	}
}

func (b *Broker) sendAll(clients map[*Client]interface{}, data []byte) {
	for client := range clients {
		if !client.send(data) {
			b.dropClient(client)
		}
	}
}

func (b *Broker) addClient(route string, client *Client) {
	clients, ok := b.clients[route]
	if !ok {
		clients = make(map[*Client]interface{})
		b.clients[route] = clients
	}
	clients[client] = nil

	b.unicastsMux.Lock()
	b.unicasts["/"+client.id] = true
	b.clientsByID[client.id] = client
	b.unicastsMux.Unlock()

	echo(Log{"t": "ui_add", "addr": client.addr, "route": route})
}

func (b *Broker) dropClient(client *Client) {
	var gc []string

	for _, route := range client.routes {
		if clients, ok := b.clients[route]; ok {
			delete(clients, client)
			if len(clients) == 0 {
				gc = append(gc, route)
			}
		}
	}

	client.quit()

	for _, route := range gc {
		delete(b.clients, route)
	}

	// FIXME leak: this is not captured in the AOF logging; page will be recreated on hydration
	b.site.del(client.id) // delete transient page, if any.

	b.unicastsMux.Lock()
	delete(b.unicasts, "/"+client.id)
	delete(b.clientsByID, client.id)
	b.unicastsMux.Unlock()

	echo(Log{"t": "ui_drop", "addr": client.addr})
}

// routes returns a sorted slice of routes managed by this broker.
func (b *Broker) routes() []string {
	b.appsMux.RLock()
	defer b.appsMux.RUnlock()

	apps := b.apps

	routes := make([]string, len(apps))
	i := 0
	for route := range apps {
		routes[i] = route
		i++
	}

	sort.Strings(routes)
	return routes
}
