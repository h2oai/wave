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

// OpsD represents the set of changes to be applied to a Page. This is a discriminated union.
type OpsD struct {
	P *PageD `json:"p,omitempty"` // page
	D []OpD  `json:"d,omitempty"` // deltas
	R int    `json:"r,omitempty"` // reset
	U string `json:"u,omitempty"` // redirect
	E string `json:"e,omitempty"` // error
	M *Meta  `json:"m,omitempty"` // metadata
	C int    `json:"c,omitempty"` // clear UI state
}

// Meta represents metadata unrelated to commands
type Meta struct {
	Username string `json:"u"` // active user's username
	Editor   bool   `json:"e"` // can the user edit pages?
}

// OpD represents a delta operation (effector)
// Discriminated union; valid combos: K, set:KV|KC|KF|KM, put:KD|KDB
type OpD struct {
	K string                 `json:"k,omitempty"` // key; ""=drop page
	V interface{}            `json:"v,omitempty"` // value
	C *CycBufD               `json:"c,omitempty"` // value
	F *FixBufD               `json:"f,omitempty"` // value
	M *MapBufD               `json:"m,omitempty"` // value
	L *ListBufD              `json:"l,omitempty"` // value
	D map[string]interface{} `json:"d,omitempty"` // card data
	B []BufD                 `json:"b,omitempty"` // card buffers
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
	C *CycBufD  `json:"c,omitempty"`
	F *FixBufD  `json:"f,omitempty"`
	M *MapBufD  `json:"m,omitempty"`
	L *ListBufD `json:"l,omitempty"`
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

type ListBufD struct {
	F []string        `json:"f"` // fields
	D [][]interface{} `json:"d"` // tuples
	N int             `json:"n"` // size
}

// AppRequest represents a request from an app.
type AppRequest struct {
	RegisterApp   *RegisterApp   `json:"register_app,omitempty"`
	UnregisterApp *UnregisterApp `json:"unregister_app,omitempty"`
}

// RegisterApp represents a request to register an app.
type RegisterApp struct {
	Mode      string `json:"mode"`
	Route     string `json:"route"`
	Address   string `json:"address"`
	KeyID     string `json:"key_id"`
	KeySecret string `json:"key_secret"`
}

// UnregisterApp represents a request to unregister an app.
type UnregisterApp struct {
	Route string `json:"route"`
}
