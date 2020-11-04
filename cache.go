package wave

import (
	"io/ioutil"
	"net/http"
	"strings"
	"sync"
)

// Shard represents a collection of key-value pairs.
type Shard struct {
	sync.RWMutex
	items map[string][]byte
}

// Cache represents a collection of shards.
type Cache struct {
	sync.RWMutex
	prefix string
	shards map[string]*Shard
}

func newCache(prefix string) *Cache {
	return &Cache{prefix: prefix, shards: make(map[string]*Shard)}
}

func (c *Cache) at(s string) *Shard {
	c.RLock()
	shard := c.shards[s]
	c.RUnlock()
	return shard
}

func (c *Cache) get(s, k string) ([]byte, bool) {
	shard := c.at(s)
	if shard == nil {
		return nil, false
	}
	shard.RLock()
	v, ok := shard.items[k]
	shard.RUnlock()
	return v, ok
}

func (c *Cache) set(s, k string, v []byte) {
	if shard := c.at(s); shard != nil {
		shard.Lock()
		shard.items[k] = v
		shard.Unlock()
		return
	}
	c.Lock()
	c.shards[s] = &Shard{items: map[string][]byte{k: v}}
	c.Unlock()
}

func (c *Cache) del(s, k string) {
	if shard := c.at(s); shard != nil {
		shard.Lock()
		delete(shard.items, k)
		shard.Unlock()
	}
}

func (c *Cache) parse(url string) (string, string) {
	p := strings.SplitN(strings.TrimPrefix(url, c.prefix), "/", 2) // "/_c/foo/bar/baz" -> "foo", "bar/baz"
	if len(p) == 2 {
		return p[0], p[1]
	}
	return "", p[0]
}

func (c *Cache) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	s, k := c.parse(r.URL.Path)
	switch r.Method {
	case http.MethodGet:
		if v, ok := c.get(s, k); ok {
			w.Write(v)
			return
		}
		http.Error(w, http.StatusText(http.StatusNotFound), http.StatusNotFound)

	case http.MethodPut:
		v, err := ioutil.ReadAll(r.Body) // XXX limit
		if err != nil {
			echo(Log{"t": "read cache request body", "error": err.Error()})
			http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
			return
		}
		c.set(s, k, v)

	case http.MethodDelete:
		c.del(s, k)

	default:
		http.Error(w, http.StatusText(http.StatusMethodNotAllowed), http.StatusMethodNotAllowed)
	}
}
