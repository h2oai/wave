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
	relayMsgT
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
	url  string
	data []byte
}

// Sub represents a subscription.
type Sub struct {
	url    string
	client *Client
}

// Broker represents a message broker.
type Broker struct {
	site        *Site
	clients     map[string]map[*Client]interface{} // route => clients
	publish     chan Pub
	subscribe   chan Sub
	unsubscribe chan *Client
	relays      map[string]*Relay // route => relay
	relaysMux   sync.RWMutex      // mutex for tracking relays
}

func newBroker(site *Site) *Broker {
	return &Broker{
		site,
		make(map[string]map[*Client]interface{}),
		make(chan Pub, 1024),
		make(chan Sub),
		make(chan *Client),
		make(map[string]*Relay),
		sync.RWMutex{},
	}
}

// relay establishes a relay to an upstream service; blocking
func (b *Broker) relay(mode, route, addr string) {
	s := newRelay(b, mode, route, addr)

	b.relaysMux.Lock()
	b.relays[route] = s
	b.relaysMux.Unlock()

	echo(Log{"t": "app_reg", "route": route, "host": addr})
}

func (b *Broker) unrelay(route string) {
	b.relaysMux.Lock()
	delete(b.relays, route)
	b.relaysMux.Unlock()

	echo(Log{"t": "app_unreg", "route": route})
}

func parseMsgT(s []byte) MsgT {
	if len(s) == 1 {
		switch s[0] {
		case '*':
			return patchMsgT
		case '@':
			return relayMsgT
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

// at looks up a relay for a given route
func (b *Broker) at(route string) *Relay {
	b.relaysMux.RLock()
	defer b.relaysMux.RUnlock()
	relay, _ := b.relays[route]
	return relay
}

// patch broadcasts changes to clients and patches site data.
func (b *Broker) patch(url string, data []byte) {
	b.publish <- Pub{url, data}
	// Write AOF entry with patch marker "*" as-is to log file.
	// FIXME bufio.Scanner.Scan() is not reliable if line length > 65536 chars,
	// so reading back in is unreliable.
	log.Println("*", url, string(data))
	if err := b.site.patch(url, data); err != nil {
		echo(Log{"t": "broker_patch", "error": err.Error()})
	}
}

// TODO allow only in debug mode?
func (b *Broker) reset(url string) {
	if data, err := json.Marshal(OpsD{R: 1}); err == nil {
		b.publish <- Pub{url, data}
	}
}

// run starts i/o between the broker and clients.
func (b *Broker) run() {
	for {
		select {
		case sub := <-b.subscribe:
			b.add(sub.url, sub.client)
		case client := <-b.unsubscribe:
			b.drop(client)
		case pub := <-b.publish:
			if clients, ok := b.clients[pub.url]; ok {
				for client := range clients {
					if !client.relay(pub.data) {
						b.drop(client)
					}
				}
			}
		}
	}
}

// add registers a client
func (b *Broker) add(url string, client *Client) {
	clients, ok := b.clients[url]
	if !ok {
		clients = make(map[*Client]interface{})
		b.clients[url] = clients
	}
	clients[client] = nil

	echo(Log{"t": "connect", "addr": client.addr, "url": url})
}

// drop unregisters a client
func (b *Broker) drop(client *Client) {
	var gc []string

	for _, url := range client.urls {
		if clients, ok := b.clients[url]; ok {
			delete(clients, client)
			if len(clients) == 0 {
				gc = append(gc, url)
			}
		}
	}

	client.quit()

	for _, url := range gc {
		delete(b.clients, url)
	}

	// FIXME leak: this is not captured in the AOF logging; page will be recreated on hydration
	b.site.del(client.id) // delete transient page, if any.

	echo(Log{"t": "disconnect", "addr": client.addr})
}

// urls returns a sorted slice of urls relayed by this broker.
func (b *Broker) urls() []string {
	b.relaysMux.RLock()
	defer b.relaysMux.RUnlock()

	relays := b.relays

	urls := make([]string, len(relays))
	i := 0
	for url := range relays {
		urls[i] = url
		i++
	}

	sort.Strings(urls)
	return urls
}
