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
	"net/http"

	"github.com/h2oai/wave/pkg/keychain"
)

// DirServer represents a file server for arbitrary directories.
type DirServer struct {
	keychain *keychain.Keychain
	auth     *Auth
	handler  http.Handler
}

func newDirServer(dir string, keychain *keychain.Keychain, auth *Auth) http.Handler {
	return &DirServer{
		keychain,
		auth,
		http.FileServer(http.Dir(dir)),
	}
}

func (ds *DirServer) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	// Disallow if:
	// - unauthorized api call
	// - auth enabled and unauthorized
	if !ds.keychain.Allow(r) && (ds.auth != nil && !ds.auth.allow(r)) { // API or UI
		http.Error(w, http.StatusText(http.StatusUnauthorized), http.StatusUnauthorized)
		return
	}

	echo(Log{"t": "file_download", "path": r.URL.Path})
	ds.handler.ServeHTTP(w, r)
}
