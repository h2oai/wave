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
	"bytes"
	"testing"
)

func TestGenerateRandString(t *testing.T) {
	eq, _, no := Assert(t)
	s, err := generateRandString(idChars, 20)
	no(err)
	eq(len(s), 20)
}

func TestCreateAccessKey(t *testing.T) {
	eq, ok, no := Assert(t)
	id, secret, hash, err := CreateAccessKey()
	no(err)
	eq(len(id), 20)
	eq(len(secret), 40)
	ok(len(hash) > 0)
}

func TestKeychainSerialization(t *testing.T) {
	eq, _, no := Assert(t)
	kc1 := make(map[string][]byte)
	for i := 0; i < 5; i++ {
		id, _, hash, err := CreateAccessKey()
		no(err)
		kc1[id] = hash
	}
	err := DumpKeychain(kc1, ".wave-keychain")
	no(err)
	kc2, err := LoadKeychain(".wave-keychain")
	no(err)
	eq(len(kc1), len(kc2))
	for k, v1 := range kc1 {
		v2 := kc2[k]
		eq(bytes.Compare(v1, v2), 0)
	}
}
