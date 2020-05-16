package telesync

// CycBuf represents a cyclic buffer.
type CycBuf struct {
	b *FixBuf
	i int
}

func newCycBuf(t Typ, n, i int) *CycBuf {
	return &CycBuf{newFixBuf(t, n), i}
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

func (b *CycBuf) dump() interface{} {
	return CycBufD{"c", b.b.t.f, b.b.tups, b.i}
}
