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
	"encoding/json"
	"mime/multipart"
	"net/http"
	"net/http/httptest"
	"os"
	"path/filepath"
	"testing"

	"github.com/h2oai/wave/pkg/assert"
	"github.com/h2oai/wave/pkg/keychain"
)

const (
	testKeyID     = "TESTKEYID"
	testKeySecret = "test-key-secret"
)

func newTestFileServer(t *testing.T) (http.Handler, string, string) {
	t.Helper()

	outerDir := t.TempDir()
	fileDir := filepath.Join(outerDir, "data")
	if err := os.MkdirAll(fileDir, 0700); err != nil {
		t.Fatal(err)
	}

	kc, err := keychain.LoadKeychain(filepath.Join(outerDir, "keychain-does-not-exist"))
	if err != nil {
		t.Fatal(err)
	}
	hash, err := keychain.HashSecret(testKeySecret)
	if err != nil {
		t.Fatal(err)
	}
	kc.Add(testKeyID, hash)

	return newFileServer(fileDir, kc, nil, "/_f"), fileDir, outerDir
}

func upload(t *testing.T, fs http.Handler, filenames ...string) *httptest.ResponseRecorder {
	t.Helper()
	return post(t, fs, false, filenames...)
}

func uploadAsDir(t *testing.T, fs http.Handler, filenames ...string) *httptest.ResponseRecorder {
	t.Helper()
	return post(t, fs, true, filenames...)
}

func post(t *testing.T, fs http.Handler, isDirUpload bool, filenames ...string) *httptest.ResponseRecorder {
	t.Helper()

	var body bytes.Buffer
	w := multipart.NewWriter(&body)
	for _, filename := range filenames {
		f, err := w.CreateFormFile("files", filename)
		if err != nil {
			t.Fatal(err)
		}
		if _, err := f.Write([]byte("payload")); err != nil {
			t.Fatal(err)
		}
	}
	if err := w.Close(); err != nil {
		t.Fatal(err)
	}

	r := httptest.NewRequest(http.MethodPost, "/_f/", &body)
	r.Header.Set("Content-Type", w.FormDataContentType())
	r.SetBasicAuth(testKeyID, testKeySecret)
	if isDirUpload {
		r.Header.Set("Wave-Directory-Upload", "True")
	}

	res := httptest.NewRecorder()
	fs.ServeHTTP(res, r)
	return res
}

func entryNames(t *testing.T, dir string) []string {
	t.Helper()
	entries, err := os.ReadDir(dir)
	if err != nil {
		t.Fatal(err)
	}
	names := make([]string, len(entries))
	for i, entry := range entries {
		names[i] = entry.Name()
	}
	return names
}

func uploadedFiles(t *testing.T, dir string) []string {
	t.Helper()
	var files []string
	if err := filepath.WalkDir(dir, func(path string, d os.DirEntry, err error) error {
		if err != nil {
			return err
		}
		if !d.IsDir() {
			rel, err := filepath.Rel(dir, path)
			if err != nil {
				return err
			}
			files = append(files, filepath.ToSlash(rel))
		}
		return nil
	}); err != nil {
		t.Fatal(err)
	}
	return files
}

func TestDirectoryUploadRejectsPathTraversal(t *testing.T) {
	eq, ok, _ := assert.Assert(t)

	for _, filename := range []string{
		"../../evil.txt",
		"../../../../../../tmp/evil.txt",
		"sub/../../../evil.txt",
		"./../evil.txt",
		"sub/dir/../d.txt",
		"..",
		".",
	} {
		fs, fileDir, outerDir := newTestFileServer(t)

		res := uploadAsDir(t, fs, filename)

		eq(entryNames(t, outerDir), []string{"data"})
		eq(res.Code, http.StatusBadRequest)
		ok(len(uploadedFiles(t, fileDir)) == 0, "no file written for", filename)
	}
}

func TestDirectoryUploadRejectsAbsolutePath(t *testing.T) {
	eq, ok, _ := assert.Assert(t)

	fs, fileDir, outerDir := newTestFileServer(t)

	res := uploadAsDir(t, fs, filepath.Join(outerDir, "evil.txt"))

	eq(entryNames(t, outerDir), []string{"data"})
	ok(len(uploadedFiles(t, fileDir)) == 0, "no file written")
	eq(res.Code, http.StatusBadRequest)
}

func TestDirectoryUploadStoresNestedFiles(t *testing.T) {
	eq, _, no := assert.Assert(t)

	fs, fileDir, _ := newTestFileServer(t)

	res := uploadAsDir(t, fs, "a.txt", "sub/c.txt", "sub/dir/e.txt", "a..b.txt", "..hidden.txt")

	eq(res.Code, http.StatusOK)

	var uploadRes UploadResponse
	no(json.Unmarshal(res.Body.Bytes(), &uploadRes))
	eq(len(uploadRes.Files), 1)

	uploadDir := filepath.Join(fileDir, filepath.Base(uploadRes.Files[0]))
	eq(uploadedFiles(t, uploadDir), []string{"..hidden.txt", "a..b.txt", "a.txt", "sub/c.txt", "sub/dir/e.txt"})

	content, err := os.ReadFile(filepath.Join(uploadDir, "sub", "dir", "e.txt"))
	no(err)
	eq(string(content), "payload")
}

func TestDirectoryUploadRejectsNonFileNames(t *testing.T) {
	eq, ok, _ := assert.Assert(t)

	for _, filename := range []string{".", "a/..", "a/", "./b.txt", "sub//c.txt"} {
		fs, fileDir, _ := newTestFileServer(t)

		res := uploadAsDir(t, fs, filename)

		eq(res.Code, http.StatusBadRequest)
		ok(len(uploadedFiles(t, fileDir)) == 0, "no file written for", filename)
	}
}

func TestFileUploadRejectsPathsInFilename(t *testing.T) {
	eq, ok, _ := assert.Assert(t)

	for _, filename := range []string{"../../evil.txt", "sub/c.txt", "/etc/passwd", "..", "."} {
		fs, fileDir, outerDir := newTestFileServer(t)

		res := upload(t, fs, filename)

		eq(res.Code, http.StatusBadRequest)
		eq(entryNames(t, outerDir), []string{"data"})
		ok(len(uploadedFiles(t, fileDir)) == 0, "no file written for", filename)
	}
}

func TestFileUploadStoresFlatFile(t *testing.T) {
	eq, _, no := assert.Assert(t)

	fs, fileDir, _ := newTestFileServer(t)

	res := upload(t, fs, "a.txt", "b.txt")

	eq(res.Code, http.StatusOK)

	var uploadRes UploadResponse
	no(json.Unmarshal(res.Body.Bytes(), &uploadRes))
	eq(len(uploadRes.Files), 2)
	eq(filepath.Base(uploadRes.Files[0]), "a.txt")
	eq(filepath.Base(uploadRes.Files[1]), "b.txt")

	files := uploadedFiles(t, fileDir)
	eq(len(files), 2)
}

func TestUploadIsAllOrNothing(t *testing.T) {
	eq, ok, _ := assert.Assert(t)

	fs, fileDir, outerDir := newTestFileServer(t)
	res := uploadAsDir(t, fs, "good.txt", "../../evil.txt", "also-good.txt")

	eq(res.Code, http.StatusBadRequest)
	eq(entryNames(t, outerDir), []string{"data"})
	ok(len(entryNames(t, fileDir)) == 0, "no upload dir left behind, got", entryNames(t, fileDir))

	fs, fileDir, _ = newTestFileServer(t)
	res = upload(t, fs, "good.txt", "../../evil.txt")

	eq(res.Code, http.StatusBadRequest)
	ok(len(entryNames(t, fileDir)) == 0, "no upload dir left behind, got", entryNames(t, fileDir))
}
