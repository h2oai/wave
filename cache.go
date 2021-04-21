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
	"bytes"
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
	prefix         string
	keychain       *Keychain
	shards         map[string]*Shard
	maxRequestSize int64
}

func newCache(prefix string, keychain *Keychain, maxRequestSize int64) *Cache {
	return &Cache{
		prefix:         prefix,
		keychain:       keychain,
		shards:         make(map[string]*Shard),
		maxRequestSize: maxRequestSize,
	}
}

func (c *Cache) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	if !c.keychain.guard(w, r) {
		return
	}

	s, k := c.parse(r.URL.Path)
	switch r.Method {
	case http.MethodGet:
		if len(k) > 0 {
			if v, ok := c.get(s, k); ok {
				w.Write(v)
				return
			}
		} else {
			if v, ok := c.keys(s); ok {
				w.Write(v)
				return
			}
		}
		http.Error(w, http.StatusText(http.StatusNotFound), http.StatusNotFound)
	case http.MethodPut:
		v, err := readRequestWithLimit(w, r.Body, c.maxRequestSize)
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

func (c *Cache) keys(s string) ([]byte, bool) {
	shard := c.at(s)
	if shard == nil {
		return nil, false
	}
	shard.RLock()
	defer shard.RUnlock()

	var b bytes.Buffer
	for k := range shard.items {
		b.WriteString(k)
		b.WriteByte('\n')
	}
	return b.Bytes(), true
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
	return p[0], ""
}
