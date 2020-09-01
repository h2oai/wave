package qd

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"
)

// Executor represents a test executor.
type Executor struct {
	cypressRoot string
	cypressPath string
}

// Batch represents a collection of test specs.
type Batch struct {
	Specs []*Spec
}

// Spec represents a test spec.
type Spec struct {
	Name string
	Code string
}

func (ex *Executor) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path != "/" {
		http.Error(w, http.StatusText(http.StatusNotFound), http.StatusNotFound)
		return
	}

	if r.Method != http.MethodPost {
		http.Error(w, http.StatusText(http.StatusMethodNotAllowed), http.StatusMethodNotAllowed)
		return
	}

	var b Batch
	if err := json.NewDecoder(r.Body).Decode(&b); err != nil {
		fmt.Printf("failed decoding request: %v\n", err)
		http.Error(w, http.StatusText(http.StatusBadRequest), http.StatusBadRequest)
		return
	}

	go ex.Execute(&b) // TODO capture test result
}

// Execute executes a Test
func (ex *Executor) Execute(batch *Batch) {
	n := len(batch.Specs)
	for i, s := range batch.Specs {
		fmt.Printf("Executing spec %d of %d: %s\n", i+1, n, s.Name)
		if err := ex.executeSpec(s); err != nil {
			fmt.Printf("failed executing spec %s: %v\n", s.Name, err)
		}
	}
}

func (ex *Executor) executeSpec(spec *Spec) error {
	integrationDir := filepath.Join(ex.cypressRoot, "cypress", "integration")
	if err := os.MkdirAll(integrationDir, 0700); err != nil {
		return fmt.Errorf("failed creating Cypress integration directory: %v", err)
	}

	specFilePath := filepath.Join(integrationDir, spec.Name+".spec.js")

	if err := ioutil.WriteFile(specFilePath, []byte(spec.Code), 0644); err != nil {
		return fmt.Errorf("failed writing spec: %v", err)
	}

	cmd := exec.Command(ex.cypressPath, "run", "--headless", "--spec", specFilePath)
	cmd.Dir = ex.cypressRoot
	output, err := cmd.CombinedOutput()
	fmt.Printf("%s\n", output)
	return err
}

// StartCypressBridge starts a proxy server for Cypress.
func StartCypressBridge(port, cypressRoot string) {
	cypressPath := filepath.Join(cypressRoot, "node_modules", ".bin", "cypress")
	executor := &Executor{cypressRoot, cypressPath}
	http.Handle("/", executor)
	fmt.Printf("Using Cypress dir: %s\n", cypressRoot)
	fmt.Printf("Q test server running on %s\n", port)
	if err := http.ListenAndServe(port, nil); err != nil {
		log.Fatal(err)
	}
}
