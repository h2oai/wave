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

// CycBuf represents a cyclic buffer.
type CycBuf struct {
	b *FixBuf
	i int
}

func (b *CycBuf) put(ixs interface{}) {
	if xs, ok := ixs.([]interface{}); ok {
		for _, x := range xs {
			b.set("", x)
		}
	}
}

func (b *CycBuf) set(_ string, v interface{}) { // append-only; ignore key
	fb := b.b
	fb.seti(b.i, v)
	b.i++
	if b.i >= len(fb.tups) {
		b.i = 0
	}
}

func (b *CycBuf) get(_ string) (Cur, bool) { // no random access; ignore key
	return b.b.geti(b.i)
}

func (b *CycBuf) dump() BufD {
	return BufD{C: &CycBufD{b.b.t.f, b.b.tups, len(b.b.tups), b.i}}
}

func loadCycBuf(ns *Namespace, b *CycBufD) *CycBuf {
	t := ns.make(b.F)
	if len(b.D) == 0 {
		n := b.N
		if n <= 0 {
			n = 10
		}
		return &CycBuf{newFixBuf(t, n), 0}
	}
	return &CycBuf{&FixBuf{t, b.D}, b.I}
}
