package telesync

import (
	"bytes"
	"log"
	"sync"
)

// MsgT represents message types.
type MsgT int

const (
	badMsgT MsgT = iota
	noopMsgT
	patchMsgT
	routeMsgT
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
	boot       = []byte("{}")
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
	clients     map[string]map[*Client]interface{} // url => clients
	publish     chan Pub
	subscribe   chan Sub
	unsubscribe chan *Client
	relays      map[string]*Relay // url => relay
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
func (b *Broker) relay(url, host string) {
	s := newRelay(b, url, host)

	b.relaysMux.Lock()
	b.relays[url] = s
	b.relaysMux.Unlock()

	echo(Log{"t": "relay", "url": url, "host": host})

	if err := s.run(); err != nil { // blocking
		echo(Log{"t": "relay", "url": url, "host": host, "error": err.Error()})
	}

	b.relaysMux.Lock()
	delete(b.relays, url)
	b.relaysMux.Unlock()
}

func parseMsgT(s []byte) MsgT {
	if len(s) == 1 {
		switch s[0] {
		case '*':
			return patchMsgT
		case '@':
			return routeMsgT
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

// at looks up a relay for a given url
func (b *Broker) at(url string) *Relay {
	b.relaysMux.RLock()
	defer b.relaysMux.RUnlock()
	relay, _ := b.relays[url]
	return relay
}

// route routes data to a service.
func (b *Broker) route(url string, data []byte) {
	relay := b.at(url)
	if relay == nil {
		echo(Log{"t": "route", "url": url, "error": "service unavailable"})
		return
	}
	relay.relay(data)
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
					if !client.route(pub.data) {
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

	echo(Log{"t": "connect", "ip": client.conn.RemoteAddr().String(), "url": url})
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

	echo(Log{"t": "disconnect", "ip": client.conn.RemoteAddr().String()})
}
