// Copyright 2020 H2O.ai, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package wave

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
