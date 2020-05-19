package telesync

// OpsD represents the set of changes to be applied to a Page. This is a discriminated union.
type OpsD struct {
	P *PageD                 `json:"p,omitempty"` // page
	C map[string]interface{} `json:"c,omitempty"` // FIXME comment - is this required?
	D []OpD                  `json:"d,omitempty"` // deltas
}

// OpD represents a delta operation (effector)
// Discriminated union; valid combos: K, set:KV|KC|KF|KM, put:KD|KDB
type OpD struct {
	K string                 `json:"k,omitempty"`     // key; ""=drop page
	V interface{}            `json:"v,omitempty"`     // value
	C *CycBufD               `json:"__c__,omitempty"` // value
	F *FixBufD               `json:"__f__,omitempty"` // value
	M *MapBufD               `json:"__m__,omitempty"` // value
	D map[string]interface{} `json:"d,omitempty"`     // card data
	B []BufD                 `json:"b,omitempty"`     // card buffers
}

// PageD represents the marshaled data for a Page.
type PageD struct {
	C map[string]CardD `json:"c"` // cards
}

// CardD represents the marshaled data for a Card.
type CardD struct {
	D map[string]interface{} `json:"d"`           // data
	B []BufD                 `json:"b,omitempty"` // buffers
}

// BufD represents the marshaled data for a buffer. This is a discriminated union.
type BufD struct {
	C *CycBufD `json:"__c__,omitempty"`
	F *FixBufD `json:"__f__,omitempty"`
	M *MapBufD `json:"__m__,omitempty"`
}

// MapBufD represents the marshaled data for a MapBuf.
type MapBufD struct {
	F []string                 `json:"f"` // fields
	D map[string][]interface{} `json:"d"` // tuples
}

// FixBufD represents the marshaled data for a FixBuf.
type FixBufD struct {
	F []string        `json:"f"` // fields
	D [][]interface{} `json:"d"` // tuples
	N int             `json:"n"` // size
}

// CycBufD represents the marshaled data for a CycBuf.
type CycBufD struct {
	F []string        `json:"f"` // fields
	D [][]interface{} `json:"d"` // tuples
	N int             `json:"n"` // size
	I int             `json:"i"` // index
}

// ConnectReq represents a connection request
// XXX move to protocol
type ConnectReq struct {
	URL  string `json:"url"`
	Host string `json:"host"`
}
