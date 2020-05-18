package telesync

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

func (b *MapBuf) dump() interface{} {
	return BufD{M: &MapBufD{b.t.f, b.tups}}
}

func loadMapBuf(ixs map[string]interface{}) interface{} {
	if ifields, ok := ixs["f"]; ok {
		if fields := loadFields(ifields); fields != nil {
			if idata, ok := ixs["d"]; ok {
				if data, ok := idata.(map[string]interface{}); ok {
					m := make(map[string][]interface{}) // PERF avoid allocation
					for k, iv := range data {
						if v, ok := iv.([]interface{}); ok {
							m[k] = v
						} else {
							return nil // FIXME log
						}
					}
					return &MapBuf{newType(fields), m}
				}
			}
		}
	}
	return nil
}
