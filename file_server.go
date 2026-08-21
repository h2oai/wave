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
	"mime"
	"mime/multipart"
	"net/http"
	"os"
	"path"
	"path/filepath"
	"strings"

	"github.com/google/uuid"
	"github.com/h2oai/wave/pkg/keychain"
)

// FileServer represents a file server.
type FileServer struct {
	dir      string
	keychain *keychain.Keychain
	auth     *Auth
	handler  http.Handler
	baseURL  string
}

func newFileServer(dir string, keychain *keychain.Keychain, auth *Auth, baseURL string) http.Handler {
	return &FileServer{
		dir,
		keychain,
		auth,
		http.FileServer(http.Dir(dir)),
		baseURL,
	}
}

var (
	errInvalidUnloadPath     = errors.New("invalid file path")
	errInvalidUploadFilename = errors.New("invalid upload filename")
)

// UploadResponse represents a response to a file upload operation.
type UploadResponse struct {
	Files []string `json:"files"`
}

func (fs *FileServer) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodGet:
		// Disallow if:
		// - unauthorized api call
		// - auth enabled and unauthorized
		if !fs.keychain.Allow(r) && (fs.auth != nil && !fs.auth.allow(r)) { // API or UI
			http.Error(w, http.StatusText(http.StatusUnauthorized), http.StatusUnauthorized)
			return
		}

		trimmedPrefix := strings.TrimPrefix(r.URL.Path, fs.baseURL)
		fsDirPath := path.Join(fs.dir, trimmedPrefix)
		// Ignore requests for directories and non-existent / unaccessible files.
		if fileInfo, err := os.Stat(filepath.FromSlash(fsDirPath)); err != nil || fileInfo.IsDir() {
			echo(Log{"t": "file_download", "path": r.URL.Path, "error": "not found"})
			http.Error(w, http.StatusText(http.StatusNotFound), http.StatusNotFound)
			return
		}

		echo(Log{"t": "file_download", "path": r.URL.Path})
		r.URL.Path = trimmedPrefix // public
		fs.handler.ServeHTTP(w, r)

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
			code := http.StatusInternalServerError
			if errors.Is(err, errInvalidUploadFilename) {
				code = http.StatusBadRequest
			}
			http.Error(w, http.StatusText(code), code)
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

	case http.MethodDelete:
		// TODO garbage collection

		if !fs.keychain.Guard(w, r) { // Allow APIs only
			return
		}

		if err := fs.deleteFile(r.URL.Path, fs.baseURL); err != nil {
			echo(Log{"t": "file_unload", "path": r.URL.Path, "error": err.Error()})
			http.Error(w, http.StatusText(http.StatusNotFound), http.StatusNotFound)
			return
		}
		echo(Log{"t": "file_unload", "path": r.URL.Path})

	default:
		echo(Log{"t": "file_download", "method": r.Method, "path": r.URL.Path, "error": "method not allowed"})
		http.Error(w, http.StatusText(http.StatusMethodNotAllowed), http.StatusMethodNotAllowed)
	}
}

func (fs *FileServer) acceptFiles(r *http.Request) ([]string, error) {
	if err := r.ParseMultipartForm(32 << 20); err != nil { // 32 MB
		return nil, fmt.Errorf("failed parsing upload form from request: %v", err)
	}

	form := r.MultipartForm
	files, ok := form.File["files"]
	if !ok {
		return nil, errors.New("want 'files' field in upload form, got none")
	}

	isDirectoryUpload := r.Header.Get("Wave-Directory-Upload")
	if isDirectoryUpload == "True" {
		return fs.storeFilesInSingleDir(files)
	}

	return fs.storeFilesInSeparateDirs(files)
}

func (fs *FileServer) deleteFile(url, baseURL string) error {
	// Remove baseURL portion if specified.
	cleanURL := strings.Replace(path.Clean(url), baseURL, "/_f", 1)
	tokens := strings.Split(cleanURL, "/")
	if len(tokens) != 4 { // /_f/uuid/file.ext
		return errInvalidUnloadPath
	}
	if tokens[0] != "" || tokens[1] != "_f" || path.Ext(tokens[3]) == "" {
		return errInvalidUnloadPath
	}

	dirpath := filepath.Join(fs.dir, tokens[2])
	return os.RemoveAll(dirpath)
}

// Need to parse the filename from the Content-Disposition header due to HTTP standard saying FileName should be basename.
// https://github.com/golang/go/blob/8dbf3e9393400d72d313e5616c88873e07692c70/src/mime/multipart/multipart.go#L82-L84
func uploadFilename(file *multipart.FileHeader) string {
	_, params, _ := mime.ParseMediaType(file.Header.Get("Content-Disposition"))
	if filename := params["filename"]; filename != "" {
		return filename
	}
	return file.Filename
}

func createUploadFile(root *os.Root, filename string) (*os.File, error) {
	if !filepath.IsLocal(filename) {
		return nil, fmt.Errorf("%w: %q", errInvalidUploadFilename, filename)
	}
	for _, segment := range strings.Split(filepath.ToSlash(filename), "/") {
		if segment == "" || segment == "." || segment == ".." {
			return nil, fmt.Errorf("%w: %q", errInvalidUploadFilename, filename)
		}
	}

	dir := filepath.Dir(filename)
	if err := root.MkdirAll(dir, 0700); err != nil {
		return nil, fmt.Errorf("failed creating dir structure %s: %v", dir, err)
	}

	dst, err := root.Create(filename)
	if err != nil {
		return nil, fmt.Errorf("failed writing uploaded file %s: %v", filename, err)
	}
	return dst, nil
}

func (fs *FileServer) storeFilesInSingleDir(files []*multipart.FileHeader) ([]string, error) {
	id, err := uuid.NewRandom()
	if err != nil {
		return nil, fmt.Errorf("failed generating file id: %v", err)
	}

	dirID := id.String()
	uploadDir := filepath.Join(fs.dir, dirID)

	if err := os.MkdirAll(uploadDir, 0700); err != nil {
		return nil, fmt.Errorf("failed creating upload dir %s: %v", uploadDir, err)
	}

	root, err := os.OpenRoot(uploadDir)
	if err != nil {
		return nil, fmt.Errorf("failed opening upload dir %s: %v", uploadDir, err)
	}
	defer root.Close()

	stored := false
	defer func() {
		if !stored {
			os.RemoveAll(uploadDir)
		}
	}()

	for _, file := range files {
		src, err := file.Open()
		if err != nil {
			return nil, fmt.Errorf("failed opening uploaded file: %v", err)
		}
		defer src.Close()

		filename := uploadFilename(file)
		dst, err := createUploadFile(root, filename)
		if err != nil {
			return nil, err
		}
		defer dst.Close()

		if _, err = io.Copy(dst, src); err != nil {
			return nil, fmt.Errorf("failed copying uploaded file %s: %v", filename, err)
		}
	}

	stored = true
	return []string{path.Join(fs.baseURL, dirID)}, nil
}

func (fs *FileServer) storeFilesInSeparateDirs(files []*multipart.FileHeader) ([]string, error) {
	uploadPaths := make([]string, len(files))

	var uploadDirs []string
	stored := false
	defer func() {
		if !stored {
			for _, uploadDir := range uploadDirs {
				os.RemoveAll(uploadDir)
			}
		}
	}()

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
		uploadDirs = append(uploadDirs, uploadDir)

		root, err := os.OpenRoot(uploadDir)
		if err != nil {
			return nil, fmt.Errorf("failed opening upload dir %s: %v", uploadDir, err)
		}
		defer root.Close()

		filename := uploadFilename(file)
		if strings.ContainsRune(filepath.ToSlash(filename), '/') {
			return nil, fmt.Errorf("%w: %q", errInvalidUploadFilename, filename)
		}

		dst, err := createUploadFile(root, filename)
		if err != nil {
			return nil, err
		}
		defer dst.Close()

		if _, err = io.Copy(dst, src); err != nil {
			return nil, fmt.Errorf("failed copying uploaded file %s: %v", filename, err)
		}

		uploadPaths[i] = path.Join(fs.baseURL, fileID, filename)
	}

	stored = true
	return uploadPaths, nil
}
