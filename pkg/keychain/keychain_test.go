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

package keychain

import (
	"bytes"
	"testing"

	"github.com/h2oai/wave/pkg/assert"
)

func TestGenerateRandString(t *testing.T) {
	eq, _, no := assert.Assert(t)
	s, err := generateRandString(idChars, 20)
	no(err)
	eq(len(s), 20)
}

func TestCreateAccessKey(t *testing.T) {
	eq, ok, no := assert.Assert(t)
	id, secret, hash, err := CreateAccessKey()
	no(err)
	eq(len(id), 20)
	eq(len(secret), 40)
	ok(len(hash) > 0)
}

func TestKeychainSerialization(t *testing.T) {
	eq, _, no := assert.Assert(t)
	kc1, err := LoadKeychain(".wave-keychain")
	no(err)
	for i := 0; i < 5; i++ {
		id, _, hash, err := CreateAccessKey()
		no(err)
		kc1.Add(id, hash)
	}
	err = kc1.Save()
	no(err)
	kc2, err := LoadKeychain(".wave-keychain")
	no(err)
	eq(len(kc1.keys), len(kc2.keys))
	for k, v1 := range kc1.keys {
		v2 := kc2.keys[k]
		eq(bytes.Compare(v1, v2), 0)
	}
}

func TestKeychainVerify(t *testing.T) {
	_, ok, no := assert.Assert(t)
	kc, err := LoadKeychain(".wave-keychain")
	no(err)

	id, secret, hash, err := CreateAccessKey()
	no(err)

	kc.Add(id, hash)
	ok(kc.verify(id, secret))
}

func TestKeychainManagement(t *testing.T) {
	eq, ok, no := assert.Assert(t)

	// drain
	kc, err := LoadKeychain(".wave-keychain")
	no(err)
	for _, id := range kc.IDs() { // clear
		kc.Remove(id)
	}
	err = kc.Save()
	no(err)

	// load empty
	kc, err = LoadKeychain(".wave-keychain")
	no(err)
	eq(0, kc.Len())

	// fill
	for i := 0; i < 5; i++ {
		id, _, hash, err := CreateAccessKey()
		no(err)
		kc.Add(id, hash)
	}
	eq(5, kc.Len())

	// ids must match
	ids := kc.IDs()
	eq(5, len(ids))
	for _, id := range ids {
		ok(kc.Remove(id))
	}

	// should be empty now
	eq(0, kc.Len())
}
