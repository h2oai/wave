package telesync

import (
	"encoding/json"
	"fmt"
	"strings"
	"sync"
)

const (
	keySeparator = " "
)

// Site represents the website, and holds a collection of pages.
type Site struct {
	sync.RWMutex
	pages map[string]*Page // url => page
	ns    *Namespace       // buffer type namespace
}

func newSite() *Site {
	return &Site{pages: make(map[string]*Page), ns: newNamespace()}
}

func (site *Site) at(url string) *Page {
	site.RLock()
	defer site.RUnlock()
	if p, ok := site.pages[url]; ok {
		return p
	}
	return nil
}

func (site *Site) get(url string) *Page {
	if p := site.at(url); p != nil {
		return p
	}

	p := newPage()

	site.Lock()
	site.pages[url] = p
	site.Unlock()

	return p
}

func (site *Site) del(url string) {
	site.Lock()
	delete(site.pages, url)
	site.Unlock()
}

func (site *Site) set(url string, data []byte) error {
	var ops OpsD
	if err := json.Unmarshal(data, &ops); err != nil {
		return fmt.Errorf("failed unmarshaling data: %v", err)
	}
	if ops.P != nil {
		site.pages[url] = loadPage(site.ns, ops.P)
	}
	return nil
}

func (site *Site) patch(url string, data []byte) error {
	var ops OpsD
	if err := json.Unmarshal(data, &ops); err != nil { // TODO speed up
		return fmt.Errorf("failed unmarshaling data: %v", err)
	}
	site.exec(url, ops)
	return nil
}

func (site *Site) exec(url string, ops OpsD) {
	page := site.get(url)
	page.Lock()
	for _, op := range ops.D {
		switch len(op) {
		case 0: // []
			site.del(url)
			page.Unlock()
			page = site.get(url)
			page.Lock()
		case 1:
			if k, ok := op[0].(string); ok { // ["foo"]
				delete(page.cards, k)
			}
		case 2:
			ik, v := op[0], op[1]
			if k, ok := ik.(string); ok {
				if len(k) > 0 {
					ks := strings.Split(k, keySeparator)
					if len(ks) == 1 { // ["foo", map[string]interface{}]
						page.cards[k] = newCard(site.ns, v)
					} else if len(ks) > 1 { // ["foo.bar", interface{}]
						if card, ok := page.cards[ks[0]]; ok {
							card.set(ks[1:], v)
						}
					}
				}
			}
		}
	}
	page.cache = nil // will be re-cached on next call to site.get(url)
	page.Unlock()
}
