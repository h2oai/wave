package telesync

import (
	"strconv"
	"strings"
)

// Buf represents a generic dictionary-like buffer.
type Buf interface {
	// get cursor at key k
	get(k string) (Cur, bool)
	// overwrite all records
	put(v interface{})
	// set record at key k
	set(k string, v interface{})
	// dump contents
	dump() BufD
}

func loadBuf(ns *Namespace, b BufD) Buf {
	if b.C != nil {
		return loadCycBuf(ns, b.C)
	}
	if b.F != nil {
		return loadFixBuf(ns, b.F)
	}
	if b.M != nil {
		return loadMapBuf(ns, b.M)
	}
	return nil
}

// Card represents an item on a Page, and holds attributes and data for rendering views.
type Card struct {
	data map[string]interface{}
}

const dataPrefix = "~"

func loadCard(ns *Namespace, c CardD) *Card {
	card := &Card{make(map[string]interface{})}
	ks := make([]string, 1) // to avoid allocation during card.set() below
	for k, v := range c.D {
		if len(k) > 0 && strings.HasPrefix(k, dataPrefix) {
			if f, ok := v.(float64); ok {
				i := int(f)
				if i >= 0 && i < len(c.B) {
					k, v = strings.TrimPrefix(k, dataPrefix), loadBuf(ns, c.B[i])
				}
			}
		}
		ks[0] = k
		card.set(ks, v)
	}
	return card
}

func (c *Card) set(ks []string, v interface{}) {
	switch len(ks) {
	case 0: // should not get here; outer interpreter loop will clobber this card.
		return
	case 1: // .foo = bar
		p := ks[0]
		if ib, ok := c.data[p]; ok { // TODO can optimize by duplicating all bufs in a card.bufs map
			if b, ok := ib.(Buf); ok { // avoid clobbering buffers; overwrite instead.
				b.put(v)
				return
			}
		}
		if v == nil {
			delete(c.data, p)
		} else {
			c.data[p] = v
		}
	default: // .foo.bar.baz = qux
		var x interface{} = c.data
		p := ks[len(ks)-1]
		for _, k := range ks[:len(ks)-1] {
			x = get(x, k)
		}
		set(x, p, v)
	}
}

func set(ix interface{}, k string, v interface{}) {
	switch x := ix.(type) {
	case Buf:
		x.set(k, v)
	case Cur:
		x.set(k, v)
	case map[string]interface{}:
		if v == nil {
			delete(x, k)
		} else {
			x[k] = v
		}
	case []interface{}:
		if i, err := strconv.Atoi(k); err == nil {
			if i >= 0 && i < len(x) {
				x[i] = v
			}
		}
	}
}

func get(ix interface{}, k string) interface{} {
	switch x := ix.(type) {
	case Buf:
		if r, ok := x.get(k); ok {
			return r
		}
	case Cur:
		return x.get(k)
	case map[string]interface{}:
		if v, ok := x[k]; ok {
			return v
		}
	case []interface{}:
		if i, err := strconv.Atoi(k); err == nil {
			if i >= 0 && i < len(x) {
				return x[i]
			}
		}
	}
	return nil
}

func (c *Card) dump() CardD {
	data := make(map[string]interface{})
	var bufs []BufD
	for k, iv := range c.data {
		if v, ok := iv.(Buf); ok {
			data[dataPrefix+k] = len(bufs)
			bufs = append(bufs, v.dump())
		} else {
			data[k] = deepClone(iv)
		}
	}
	return CardD{data, bufs}
}

func deepClone(ix interface{}) interface{} {
	switch x := ix.(type) {
	case map[string]interface{}:
		m := make(map[string]interface{})
		for k, v := range x {
			m[k] = deepClone(v)
		}
		return m
	case []interface{}:
		s := make([]interface{}, len(x))
		for i, v := range x {
			s[i] = deepClone(v)
		}
		return s
	}
	return ix
}
