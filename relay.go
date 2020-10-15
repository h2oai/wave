package wave

import (
	"fmt"
	"strconv"
	"time"

	"github.com/gorilla/websocket"
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
	mode   RelayMode     // mode
	route  string        // route
	addr   string        // upstream address ws[s]://host:port
	send   chan []byte   // send data to target
	quit   chan struct{} // quit routing
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
		toRelayMode(mode),
		route,
		addr,
		make(chan []byte, 1024), // TODO revise size
		make(chan struct{}, 1),
	}
}

const (
	relayConnectMaxRetries    = 20
	relayConnectRetryInterval = time.Millisecond * 500
	relayDisconnectTimeout    = time.Second
)

// connect connects to the upstream service.
func (s *Relay) connect() (c *websocket.Conn, err error) {
	for i := 1; i <= relayConnectMaxRetries; i++ {
		echo(Log{"t": "relay-connect", "route": s.route, "addr": s.addr, "attempt": strconv.Itoa(i)})
		c, _, err = websocket.DefaultDialer.Dial(s.addr, nil)
		if err == nil {
			return
		}
		time.Sleep(relayConnectRetryInterval)
	}
	err = fmt.Errorf("failed connecting to service %s at %s after %d attempts", s.route, s.addr, relayConnectMaxRetries)
	return
}

// relay relays data to the upstream service
func (s *Relay) relay(data []byte) bool {
	select {
	case s.send <- data:
		return true
	default:
		return false
	}
}

// run starts i/o from/to the upstream service.
func (s *Relay) run() error {
	c, err := s.connect()
	if err != nil {
		return fmt.Errorf("failed connecting to service: %v", err)
	}
	defer c.Close()

	done := make(chan error)

	go func() {
		defer close(done)
		for {
			_, msg, err := c.ReadMessage()
			if err != nil {
				done <- fmt.Errorf("failed reading from service: %v", err)
				return
			}

			m := parseMsg(msg)
			switch m.t {
			case patchMsgT:
				s.broker.patch(m.addr, m.data)
			case relayMsgT:
				relay := s.broker.at(m.addr)
				if relay == nil {
					echo(Log{"t": "reroute", "route": m.addr, "error": "service unavailable"})
					continue
				}
				relay.relay(m.data)
			}
		}
	}()

	for {
		select {
		case err := <-done:
			return err
		case data := <-s.send:
			err := c.WriteMessage(websocket.TextMessage, data)
			if err != nil {
				return fmt.Errorf("failed writing to service: %v", err)
			}
		case <-s.quit:
			echo(Log{"t": "relay-disconnect", "url": s.route, "host": s.addr})

			// Attempt clean close: send close, wait for service to close, time-out.
			err := c.WriteMessage(websocket.CloseMessage, websocket.FormatCloseMessage(websocket.CloseNormalClosure, ""))
			if err != nil {
				return fmt.Errorf("failed closing service route: %v", err)
			}
			select {
			case <-done:
			case <-time.After(relayDisconnectTimeout):
			}
			return nil
		}
	}

}
