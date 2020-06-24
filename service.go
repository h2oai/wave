package telesync

import (
	"bytes"
	"net/http"
)

// Service represents a remote service.
type Service struct {
	broker *Broker
	url    string // target service url
	host   string // target host or host:port
}

func newService(broker *Broker, url, host string) *Service {
	return &Service{
		broker,
		url,
		host,
	}
}

func (s *Service) route(data []byte) bool {
	resp, err := http.Post(s.host, "application/json", bytes.NewReader(data))
	if err != nil {
		echo(Log{"t": "service_route", "url": s.url, "host": s.host, "error": err.Error()})
		return false
	}
	resp.Body.Close()
	return true
}
