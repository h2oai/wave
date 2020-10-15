package wave

import (
	"strconv"
	"strings"
	"sync"
)

// Namespace is a cache of all known data types in use.
type Namespace struct {
	sync.RWMutex
	types map[string]Typ // "foo\nbar\nbaz" -> type
}

func newNamespace() *Namespace {
	return &Namespace{types: make(map[string]Typ)}
}

func (ns *Namespace) get(k string) (Typ, bool) {
	ns.RLock()
	defer ns.RUnlock()
	t, ok := ns.types[k]
	return t, ok
}

func (ns *Namespace) make(fields []string) Typ {
	if len(fields) == 0 {
		return Typ{}
	}
	k := strings.Join(fields, "\n")
	if t, ok := ns.get(k); ok {
		return t
	}
	t := newType(fields)
	ns.Lock()
	ns.types[k] = t
	ns.Unlock()
	return t
}

// Typ represents a data type.
type Typ struct {
	f []string       // fields
	m map[string]int // offsets
}

func newType(fields []string) Typ {
	m := make(map[string]int)
	for i, f := range fields {
		m[f] = i
	}
	return Typ{fields, m}
}

func (t Typ) match(x interface{}) ([]interface{}, bool) {
	if x, ok := x.([]interface{}); ok && len(x) == len(t.f) {
		return x, true
	}
	return nil, false
}

// Cur represents a type-aware cursor for accessing fields in a tuple.
type Cur struct {
	t   Typ
	tup []interface{}
}

func (c Cur) get(f string) interface{} {
	t, tup := c.t, c.tup
	if tup != nil {
		if i, ok := t.m[f]; ok { // string key?
			if i >= 0 && i < len(tup) {
				return tup[i]
			}
		} else if i, err := strconv.Atoi(f); err == nil { // integer index?
			if i >= 0 && i < len(tup) {
				return tup[i]
			}
		}
	}
	return nil
}

func (c Cur) set(f string, v interface{}) {
	t, tup := c.t, c.tup
	if tup != nil {
		if i, ok := t.m[f]; ok {
			if i >= 0 && i < len(tup) {
				tup[i] = v
			}
		} else if i, err := strconv.Atoi(f); err == nil {
			if i >= 0 && i < len(tup) {
				tup[i] = v
			}
		}
	}
}
