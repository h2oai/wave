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
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"os"
	"path"
	"path/filepath"

	"github.com/google/uuid"
	"github.com/h2oai/wave/pkg/keychain"
)

// FileStore represents a file store.
type FileStore struct {
	dir      string
	keychain *keychain.Keychain
	auth     *Auth
}

func newFileStore(dir string, keychain *keychain.Keychain, auth *Auth) http.Handler {
	return &FileStore{dir, keychain, auth}
}

// UploadResponse represents a response to a file upload operation.
type UploadResponse struct {
	Files []string `json:"files"`
}

func (fs *FileStore) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodPost:
		// Disallow if:
		// - unauthorized api call
		// - auth enabled and unauthorized
		if !fs.keychain.Allow(r) && (fs.auth != nil && !fs.auth.allow(r)) { // API or UI
			http.Error(w, http.StatusText(http.StatusUnauthorized), http.StatusUnauthorized)
			return
		}

		files, err := fs.acceptFiles(r)
		if err != nil {
			echo(Log{"t": "file_upload", "error": err.Error()})
			http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
			return
		}

		res, err := json.Marshal(UploadResponse{Files: files})
		if err != nil {
			echo(Log{"t": "file_upload", "error": err.Error()})
			http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		w.Write(res)
	default:
		echo(Log{"t": "file_upload", "method": r.Method, "path": r.URL.Path, "error": "method not allowed"})
		http.Error(w, http.StatusText(http.StatusMethodNotAllowed), http.StatusMethodNotAllowed)
	}
}

func (fs *FileStore) acceptFiles(r *http.Request) ([]string, error) {
	if err := r.ParseMultipartForm(32 << 20); err != nil { // 32 MB
		return nil, fmt.Errorf("failed parsing upload form from request: %v", err)
	}

	form := r.MultipartForm
	files, ok := form.File["files"]
	if !ok {
		return nil, errors.New("want 'files' field in upload form, got none")
	}

	uploadPaths := make([]string, len(files))
	for i, file := range files {

		id, err := uuid.NewRandom()
		if err != nil {
			return nil, fmt.Errorf("failed generating file id: %v", err)
		}

		src, err := file.Open()
		if err != nil {
			return nil, fmt.Errorf("failed opening uploaded file: %v", err)
		}
		defer src.Close()

		fileID := id.String()
		uploadDir := filepath.Join(fs.dir, fileID)

		if err := os.MkdirAll(uploadDir, 0700); err != nil {
			return nil, fmt.Errorf("failed creating upload dir %s: %v", uploadDir, err)
		}

		basename := filepath.Base(file.Filename)
		uploadPath := filepath.Join(uploadDir, basename)

		dst, err := os.Create(uploadPath)
		if err != nil {
			return nil, fmt.Errorf("failed writing uploaded file %s: %v", uploadPath, err)
		}
		defer dst.Close()

		if _, err = io.Copy(dst, src); err != nil {
			return nil, fmt.Errorf("failed copying uploaded file %s: %v", uploadPath, err)
		}

		uploadPaths[i] = path.Join("/_f", fileID, basename)
	}
	return uploadPaths, nil
}
