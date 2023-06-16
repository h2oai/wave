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
	"strconv"
	"strings"
)

// Buf represents a generic dictionary-like buffer.
type Buf interface {
	// get cursor at key k
	get(k string) (Cur, bool)
	// overwrite all records
	put(v any)
	// set record at key k
	set(k string, v any)
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
	if b.L != nil {
		return loadListBuf(ns, b.L)
	}
	return nil
}

// Card represents an item on a Page, and holds attributes and data for rendering views.
type Card struct {
	data             map[string]any
	nameComponentMap map[string]any // Cache for cards with items, secondary_items or buttons.
}

const dataPrefix = "~"

func loadCard(ns *Namespace, c CardD) *Card {
	card := &Card{
		data:             make(map[string]any),
		nameComponentMap: nil,
	}
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
		if k == "items" || k == "secondary_items" || k == "buttons" {
			if card.nameComponentMap == nil {
				card.nameComponentMap = make(map[string]any)
			}
			fillNameComponentMap(card.nameComponentMap, v)
		}
		ks[0] = k
		card.set(ks, v)
	}
	return card
}

func (c *Card) set(ks []string, v any) {
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
		var x any = c.data

		// By-name access.
		if v, ok := c.nameComponentMap[ks[0]]; ok && len(ks) == 2 {
			x = v
		} else {
			// DEPRECATED: Access via page.items[idx].wrapper.prop.
			for _, k := range ks[:len(ks)-1] {
				x = get(x, k)
			}
		}

		p := ks[len(ks)-1]
		set(x, p, v)
	}
}

func set(ix any, k string, v any) {
	switch x := ix.(type) {
	case Buf:
		x.set(k, v)
	case Cur:
		x.set(k, v)
	case map[string]any:
		if v == nil {
			delete(x, k)
		} else {
			x[k] = v
		}
	case []any:
		if i, err := strconv.Atoi(k); err == nil {
			if i >= 0 && i < len(x) {
				x[i] = v
			}
		}
	}
}

func get(ix any, k string) any {
	switch x := ix.(type) {
	case Buf:
		if r, ok := x.get(k); ok {
			return r
		}
	case Cur:
		return x.get(k)
	case map[string]any:
		if v, ok := x[k]; ok {
			return v
		}
	case []any:
		if i, err := strconv.Atoi(k); err == nil {
			if i >= 0 && i < len(x) {
				return x[i]
			}
		}
	}
	return nil
}

func (c *Card) dump() CardD {
	data := make(map[string]any)
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

func deepClone(ix any) any {
	switch x := ix.(type) {
	case map[string]any:
		m := make(map[string]any)
		for k, v := range x {
			m[k] = deepClone(v)
		}
		return m
	case []any:
		s := make([]any, len(x))
		for i, v := range x {
			s[i] = deepClone(v)
		}
		return s
	}
	return ix
}

func fillNameComponentMap(m map[string]any, wrappedItems any) {
	for _, wrappedItem := range wrappedItems.([]any) {
		// Form components are always wrapped in a single key object so this is O(1) not O(n).
		for _, item := range wrappedItem.(map[string]any) {

			var component map[string]any
			if i, ok := item.(map[string]any); ok {
				component = i
			} else {
				// Handle non-form components, e.g. ui.tab.
				component = wrappedItem.(map[string]any)
			}
			if name, ok := component["name"]; ok {
				if n, ok := name.(string); ok {
					m[n] = item
				}
			}
			if items, ok := component["items"]; ok {
				fillNameComponentMap(m, items)
			}
			if secondaryItems, ok := component["secondary_items"]; ok {
				fillNameComponentMap(m, secondaryItems)
			}
			if buttons, ok := component["buttons"]; ok {
				fillNameComponentMap(m, buttons)
			}
		}
	}
}
