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

import "strconv"

// ListBuf represents a list (dynamic array) buffer.
type ListBuf struct {
	b *FixBuf
	i int
}

func (b *ListBuf) put(ixs any) {
	if xs, ok := ixs.([]any); ok {
		for _, x := range xs {
			b.set("", x)
		}
	}
}

func (b *ListBuf) set(key string, v any) {
	fb := b.b
	// Check if key is a valid index.
	if i, err := strconv.Atoi(key); err == nil {
		if i < 0 {
			i += b.i
		}
		if i < 0 {
			i += len(fb.tups)
		}
		if i >= 0 && i < len(fb.tups) {
			fb.seti(i, v)
			return
		}
	}
	// Otherwise, append to the current end.
	if b.i >= len(fb.tups) {
		xs := make([][]interface{}, len(fb.tups)*2)
		tups := fb.tups
		fb.tups = xs

		for i, t := range tups {
			fb.seti(i, t)
		}
	}
	fb.seti(b.i, v)
	b.i++
}

func (b *ListBuf) get(key string) (Cur, bool) {
	// Check if key is a valid index.
	if i, err := strconv.Atoi(key); err == nil {
		if i < 0 {
			i += len(b.b.tups)
		}
		return b.b.geti(i)
	}

	return b.b.geti(b.i)
}

func (b *ListBuf) dump() BufD {
	return BufD{L: &ListBufD{b.b.t.f, b.b.tups}}
}

func loadListBuf(ns *Namespace, b *ListBufD) *ListBuf {
	t := ns.make(b.F)
	if len(b.D) == 0 {
		return &ListBuf{newFixBuf(t, 10), 9}
	}
	return &ListBuf{&FixBuf{t, b.D}, len(b.D)}
}
