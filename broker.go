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
	invalidMsg = Msg{t: badMsgT}
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
	clients     map[string]map[*Client]interface{} // route => clients
	publish     chan Pub
	subscribe   chan Sub
	unsubscribe chan *Client
	apps        map[string]*App // route => app
	appsMux     sync.RWMutex    // mutex for tracking apps
}

func newBroker(site *Site) *Broker {
	return &Broker{
		site,
		make(map[string]map[*Client]interface{}),
		make(chan Pub, 1024),
		make(chan Sub),
		make(chan *Client),
		make(map[string]*App),
		sync.RWMutex{},
	}
}

func (b *Broker) addApp(mode, route, addr string) {
	s := newApp(b, mode, route, addr)

	b.appsMux.Lock()
	b.apps[route] = s
	b.appsMux.Unlock()

	echo(Log{"t": "app_add", "route": route, "host": addr})

	// Force-reload all browsers listening to this app
	b.reset(route) // TODO allow only in debug mode?
}

func (b *Broker) dropApp(route string) {
	b.appsMux.Lock()
	delete(b.apps, route)
	b.appsMux.Unlock()

	echo(Log{"t": "app_drop", "route": route})

	// Force-reload all browsers listening to this app
	b.reset(route) // TODO allow only in debug mode?
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

func (b *Broker) getApp(route string) *App {
	b.appsMux.RLock()
	defer b.appsMux.RUnlock()
	app, _ := b.apps[route]
	return app
}

// patch broadcasts changes to clients and patches site data.
func (b *Broker) patch(route string, data []byte) {
	b.publish <- Pub{route, data}
	// Write AOF entry with patch marker "*" as-is to log file.
	// FIXME bufio.Scanner.Scan() is not reliable if line length > 65536 chars,
	// so reading back in is unreliable.
	log.Println("*", route, string(data))
	if err := b.site.patch(route, data); err != nil {
		echo(Log{"t": "broker_patch", "error": err.Error()})
	}
}

// TODO allow only in debug mode?
func (b *Broker) reset(route string) {
	if data, err := json.Marshal(OpsD{R: 1}); err == nil {
		b.publish <- Pub{route, data}
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
				for client := range clients {
					if !client.send(pub.data) {
						b.dropClient(client)
					}
				}
			}
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
