package wave

import (
	"bytes"
	"io/ioutil"
	"net/http"
)

// RelayMode represents relay modes.
type RelayMode int

const (
	unicastMode RelayMode = iota
	multicastMode
	broadcastMode
)

// Relay represents a relay to an upstream service.
type Relay struct {
	broker *Broker
	client *http.Client
	mode   RelayMode // mode
	route  string    // route
	addr   string    // upstream address http://host:port
}

// Boot represents the initial message sent when a relay is established
type Boot struct {
	Hash string `json:"#,omitempty"` // location hash
}

func toRelayMode(mode string) RelayMode {
	switch mode {
	case "broadcast":
		return broadcastMode
	case "multicast":
		return multicastMode
	}
	return unicastMode
}

func newRelay(broker *Broker, mode, route, addr string) *Relay {
	return &Relay{
		broker,
		&http.Client{}, // TODO tune keep-alive and idle timeout
		toRelayMode(mode),
		route,
		addr,
	}
}

// relay relays data to the upstream service
func (s *Relay) relay(data []byte) {
	if !s.send(data) {
		s.broker.unrelay(s.route)
	}
}

func (s *Relay) send(data []byte) bool {
	resp, err := s.client.Post(s.addr, "text/plain; charset=utf-8", bytes.NewReader(data))
	if err != nil {
		echo(Log{"t": "relay", "route": s.route, "host": s.addr, "error": err.Error()})
		return false
	}
	defer resp.Body.Close()
	if _, err := ioutil.ReadAll(resp.Body); err != nil {
		echo(Log{"t": "relay", "route": s.route, "host": s.addr, "error": err.Error()})
		return false
	}
	return true
}
