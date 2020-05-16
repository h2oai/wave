package telesync

import (
	"encoding/json"
	"sync"
)

// Page represents a web page.
type Page struct {
	sync.RWMutex
	cards map[string]*Card
	cache []byte
}

func newPage() *Page {
	return &Page{cards: make(map[string]*Card)}
}

func (p *Page) read() []byte {
	p.RLock()
	defer p.RUnlock()
	return p.cache
}

func (p *Page) marshal() []byte {
	if cache := p.read(); cache != nil {
		return cache
	}

	p.Lock()
	defer p.Unlock()

	c := make(map[string]CardD)
	for k, v := range p.cards {
		c[k] = v.dump()
	}

	cache, err := json.Marshal(OpsD{P: PageD{c}})
	if err != nil {
		echo(Log{"t": "page_marshal", "error": err.Error()})
		return nil
	}
	p.cache = cache
	return cache
}
