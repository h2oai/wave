package wave

import (
	"encoding/json"
	"fmt"
	"sort"
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

// at returns the page at url, else nil
func (site *Site) at(url string) *Page {
	site.RLock()
	defer site.RUnlock()
	if p, ok := site.pages[url]; ok {
		return p
	}
	return nil
}

// get returns the page at url, else mints a new one.
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

// del deletes the page at url.
func (site *Site) del(url string) {
	site.Lock()
	delete(site.pages, url)
	site.Unlock()
}

// set overwrites a page's content.
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

// patch patches a page's content.
func (site *Site) patch(url string, data []byte) error {
	var ops OpsD
	if err := json.Unmarshal(data, &ops); err != nil { // TODO speed up
		return fmt.Errorf("failed unmarshaling data: %v", err)
	}
	site.exec(url, ops)
	return nil
}

// exec applies changes to a page's content.
func (site *Site) exec(url string, ops OpsD) {
	page := site.get(url)
	page.Lock()
	for _, op := range ops.D {
		if len(op.K) > 0 {
			if op.C != nil {
				page.set(op.K, loadCycBuf(site.ns, op.C))
			} else if op.F != nil {
				page.set(op.K, loadFixBuf(site.ns, op.F))
			} else if op.M != nil {
				page.set(op.K, loadMapBuf(site.ns, op.M))
			} else if op.D != nil {
				page.cards[op.K] = loadCard(site.ns, CardD{op.D, op.B})
			} else {
				page.set(op.K, op.V)
			}
		} else { // drop page
			site.del(url)
			page.Unlock()
			page = site.get(url)
			page.Lock()
		}
	}
	page.cache = nil // will be re-cached on next call to site.get(url)
	page.Unlock()
}

// urls returns a sorted slice of urls hosted by this site.
func (site *Site) urls() []string {
	site.RLock()
	defer site.RUnlock()

	pages := site.pages

	urls := make([]string, len(pages))
	i := 0
	for url := range pages {
		urls[i] = url
		i++
	}

	sort.Strings(urls)
	return urls
}
