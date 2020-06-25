package telesync

import (
	"fmt"
	"net/url"
	"strconv"
	"time"

	"github.com/gorilla/websocket"
)

// Relay represents a relay to an upstream service.
type Relay struct {
	broker *Broker
	url    string        // route
	host   string        // upstream host or host:port
	send   chan []byte   // send data to target
	quit   chan struct{} // quit routing
}

func newRelay(broker *Broker, url, host string) *Relay {
	return &Relay{
		broker,
		url,
		host,
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
	u := url.URL{Scheme: "ws", Host: s.host} // TODO wss
	urlStr := u.String()

	for i := 1; i <= relayConnectMaxRetries; i++ {
		echo(Log{"t": "relay-connect", "url": s.url, "host": urlStr, "attempt": strconv.Itoa(i)})
		c, _, err = websocket.DefaultDialer.Dial(urlStr, nil)
		if err == nil {
			return
		}
		time.Sleep(relayConnectRetryInterval)
	}
	err = fmt.Errorf("failed connecting to service %s at %s after %d attempts", s.url, urlStr, relayConnectMaxRetries)
	return
}

// route routes data to the upstream service
func (s *Relay) route(data []byte) bool {
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
			case routeMsgT:
				s.broker.route(m.addr, m.data)
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
			echo(Log{"t": "relay-disconnect", "url": s.url, "host": s.host})

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
