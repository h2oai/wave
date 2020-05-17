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
	services    map[string]*Service // url => service
	servicesMux sync.RWMutex        // mutex for tracking services
}

func newBroker(site *Site) *Broker {
	return &Broker{
		site,
		make(map[string]map[*Client]interface{}),
		make(chan Pub, 1024),
		make(chan Sub),
		make(chan *Client),
		make(map[string]*Service),
		sync.RWMutex{},
	}
}

// bridge establishes a route to a service.
func (b *Broker) bridge(url, host string) {
	s := newService(b, url, host)

	b.servicesMux.Lock()
	b.services[url] = s
	b.servicesMux.Unlock()

	s.send <- boot

	if err := s.run(); err != nil { // blocking
		echo(Log{"t": "bridge", "host": host, "error": err.Error()})
	}

	b.servicesMux.Lock()
	delete(b.services, url)
	b.servicesMux.Unlock()
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

// route routes data to a service.
func (b *Broker) route(url string, data []byte) {
	b.servicesMux.RLock()
	service, ok := b.services[url]
	b.servicesMux.RUnlock()
	if !ok {
		echo(Log{"t": "route", "url": url, "error": "service not found"})
		return
	}
	service.route(data)
}

// patch broadcasts changes to clients and patches site data.
func (b *Broker) patch(url string, data []byte) {
	b.publish <- Pub{url, data}
	// Write AOF entry with patch marker "*" as-is to log file.
	// FIXME bufio.Scanner.Scan() is not reliable if line length > 65536 chars,
	// so reading back in is unreliable.
	log.Println("*", url, string(data))
	b.site.patch(url, data)
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
