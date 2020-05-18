package telesync

// OpsD represents a set of changes to be applied to a Page.
type OpsD struct {
	P *PageD                 `json:"p,omitempty"` // page
	C map[string]interface{} `json:"c,omitempty"` // comment
	D [][]interface{}        `json:"d,omitempty"` // deltas
	// Delta operations:
	// put := ["foo", props map]
	// set := ["foo.bar", value interface{}]
	// del := [] or ["foo"]

}

// PageD represents the marshaled data for a Page.
type PageD struct {
	C map[string]CardD `json:"c"` // cards
}

// CardD represents the marshaled data for a Card.
type CardD struct {
	D interface{} `json:"d"` // data
}

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
}

// CycBufD represents the marshaled data for a CycBuf.
type CycBufD struct {
	F []string        `json:"f"` // fields
	D [][]interface{} `json:"d"` // tuples
	I int             `json:"i"` // index
}

// ConnectReq represents a connection request
// XXX move to protocol
type ConnectReq struct {
	URL  string `json:"url"`
	Host string `json:"host"`
}
