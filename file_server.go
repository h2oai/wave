package wave

import (
	"errors"
	"net/http"
	"os"
	"path"
	"path/filepath"
	"strings"
)

// FileServer represents a file server.
type FileServer struct {
	dir     string
	handler http.Handler
}

func newFileServer(dir string) http.Handler {
	return &FileServer{
		dir,
		http.FileServer(http.Dir(dir)),
	}
}

var (
	errInvalidUnloadPath = errors.New("invalid file path")
)

func (fs *FileServer) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodGet:
		if path.Ext(r.URL.Path) == "" { // ignore requests for directories and ext-less files
			echo(Log{"t": "file_download", "path": r.URL.Path, "error": "not found"})
			http.Error(w, http.StatusText(http.StatusNotFound), http.StatusNotFound)
			return
		}

		echo(Log{"t": "file_download", "path": r.URL.Path})
		r.URL.Path = strings.TrimPrefix(r.URL.Path, "/_f") // public
		fs.handler.ServeHTTP(w, r)

	case http.MethodDelete: // TODO garbage collection
		if err := fs.unloadFile(r.URL.Path); err != nil {
			echo(Log{"t": "file_unload", "path": r.URL.Path, "error": err.Error()})
			return
		}
		echo(Log{"t": "file_unload", "path": r.URL.Path})

	default:
		echo(Log{"t": "file_download", "method": r.Method, "path": r.URL.Path, "error": "method not allowed"})
		http.Error(w, http.StatusText(http.StatusMethodNotAllowed), http.StatusMethodNotAllowed)
	}
}

func (fs *FileServer) unloadFile(url string) error {
	tokens := strings.Split(path.Clean(url), "/")
	if len(tokens) != 4 { // /_f/uuid/file.ext
		return errInvalidUnloadPath
	}
	if tokens[0] != "" || tokens[1] != "_f" || path.Ext(tokens[3]) == "" {
		return errInvalidUnloadPath
	}

	dirpath := filepath.Join(fs.dir, tokens[2])
	return os.RemoveAll(dirpath)
}
