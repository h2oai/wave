package qd

import (
	"encoding/json"
	"strings"
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

func (p *Page) set(k string, v interface{}) {
	ks := strings.Split(k, keySeparator) // PERF avoid allocation
	if len(ks) == 1 {
		delete(p.cards, k)
		return
	}

	if card, ok := p.cards[ks[0]]; ok {
		card.set(ks[1:], v)
	}
}

func (p *Page) dump() *PageD {
	c := make(map[string]CardD)
	for k, v := range p.cards {
		c[k] = v.dump()
	}
	return &PageD{c}
}

func (p *Page) marshal() []byte {
	if cache := p.read(); cache != nil {
		return cache
	}

	p.Lock()
	defer p.Unlock()

	cache, err := json.Marshal(OpsD{P: p.dump()})
	if err != nil {
		echo(Log{"t": "page_marshal", "error": err.Error()})
		return nil
	}
	p.cache = cache // invalidated by site exec() under write-lock
	return cache
}

func loadPage(ns *Namespace, d *PageD) *Page {
	cards := make(map[string]*Card)
	for k, v := range d.C {
		cards[k] = loadCard(ns, v)
	}
	return &Page{cards: cards}
}
