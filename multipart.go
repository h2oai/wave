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
	"crypto/rand"
	"fmt"
	"io"
	"io/ioutil"
	"net/http"
	"strings"
	"sync"

	"github.com/h2oai/wave/pkg/keychain"
)

var nothing = struct{}{}

// MultipartSource represents a source of multipart data.
type MultipartSource struct {
	sync.RWMutex
	targets map[chan *MultipartFrame]struct{}
}

// MultipartFrame represents a single frame in a multipart stream.
type MultipartFrame struct {
	contentType string
	data        []byte
}

// MultipartServer handles multipart/x-mixed-replace content.
type MultipartServer struct {
	sync.RWMutex
	prefix         string
	keychain       *keychain.Keychain
	auth           *Auth
	maxRequestSize int64
	sources        map[string]*MultipartSource
}

func newMultipartServer(prefix string, keychain *keychain.Keychain, auth *Auth, maxRequestSize int64) *MultipartServer {
	return &MultipartServer{
		prefix:         prefix,
		keychain:       keychain,
		auth:           auth,
		maxRequestSize: maxRequestSize,
		sources:        make(map[string]*MultipartSource),
	}
}

func randomBoundary() string {
	var buf [30]byte
	_, err := io.ReadFull(rand.Reader, buf[:])
	if err != nil {
		panic(err)
	}
	return fmt.Sprintf("%x", buf[:])
}

func (s *MultipartServer) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	key := strings.TrimPrefix(r.URL.Path, s.prefix)
	switch r.Method {
	case http.MethodGet:
		if s.auth != nil && !s.auth.allow(r) {
			http.Error(w, http.StatusText(http.StatusUnauthorized), http.StatusUnauthorized)
			return
		}

		s.RLock()
		source, ok := s.sources[key]
		s.RUnlock()
		if !ok {
			http.Error(w, http.StatusText(http.StatusNotFound), http.StatusNotFound)
			return
		}

		frames := make(chan *MultipartFrame, 256)
		source.Lock()
		source.targets[frames] = nothing
		source.Unlock()

		boundary := randomBoundary()
		w.Header().Set("Content-Type", "multipart/x-mixed-replace; boundary="+boundary)

		for frame := range frames { // blocking
			fmt.Fprintf(w, "Content-Type: %s\r\n", frame.contentType)
			fmt.Fprintf(w, "Content-Length: %d\r\n\r\n", len(frame.data))
			w.Write(frame.data)
			fmt.Fprintf(w, "\r\n--%s\r\n", boundary)
		}

	case http.MethodPost:
		if !s.keychain.Guard(w, r) {
			return
		}

		s.RLock()
		source, ok := s.sources[key]
		s.RUnlock()
		if !ok {
			source = &MultipartSource{targets: make(map[chan *MultipartFrame]struct{})}
			s.Lock()
			s.sources[key] = source
			s.Unlock()
		}

		mr, err := r.MultipartReader()
		if err != nil {
			echo(Log{"t": "multipart_read", "error": err.Error()})
			http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
			return
		}

		part, err := mr.NextPart()
		if err == io.EOF {
			break
		}
		data, err := ioutil.ReadAll(io.LimitReader(part, s.maxRequestSize))
		if err != nil {
			echo(Log{"t": "multipart_read", "error": err.Error()})
			http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
			return
		}
		contentType := part.Header.Get("Content-Type")
		for _, frames := range source.getTargets() {
			select {
			case frames <- &MultipartFrame{contentType, data}:
			default: // full; drop frame
			}
		}

	case http.MethodDelete:
		if !s.keychain.Guard(w, r) {
			return
		}

		s.RLock()
		source, ok := s.sources[key]
		s.RUnlock()
		if !ok {
			return
		}

		for _, frames := range source.getTargets() {
			close(frames) // terminate GETs
		}

		s.Lock()
		delete(s.sources, key)
		s.Unlock()
	}
}

func (s *MultipartSource) getTargets() []chan *MultipartFrame {
	s.RLock()
	defer s.RUnlock()
	var targets []chan *MultipartFrame
	for t := range s.targets {
		targets = append(targets, t)
	}
	return targets
}
