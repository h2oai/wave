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

// MapBuf represents a map (dictionary) buffer.
type MapBuf struct {
	t    Typ
	tups map[string][]interface{}
}

func newMapBuf(t Typ) *MapBuf {
	return &MapBuf{t, make(map[string][]interface{})}
}

func (b *MapBuf) put(ixs interface{}) {
	if xs, ok := ixs.(map[string]interface{}); ok {
		tups := make(map[string][]interface{})
		for k, x := range xs {
			if tup, ok := b.t.match(x); ok {
				tups[k] = tup
			}
		}
		b.tups = tups
	}
}

func (b *MapBuf) set(k string, v interface{}) {
	if v == nil {
		delete(b.tups, k)
	} else if tup, ok := b.t.match(v); ok {
		b.tups[k] = tup
	}
}

func (b *MapBuf) get(k string) (Cur, bool) {
	if tup, ok := b.tups[k]; ok {
		return Cur{b.t, tup}, true
	}
	return Cur{}, false
}

func (b *MapBuf) dump() BufD {
	return BufD{M: &MapBufD{b.t.f, b.tups}}
}

func loadMapBuf(ns *Namespace, b *MapBufD) *MapBuf {
	t := ns.make(b.F)
	if b.D == nil {
		return newMapBuf(t)
	}
	return &MapBuf{t, b.D}
}
