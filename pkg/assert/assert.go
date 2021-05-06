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

package assert

import (
	"fmt"
	"path/filepath"
	"reflect"
	"runtime"
	"testing"
)

// https://medium.com/@benbjohnson/structuring-tests-in-go-46ddee7a25c
// Adapted from: https://github.com/benbjohnson/testing

// Eq fails if expected and actual are different
type Eq func(expected, actual interface{})

// Ok fails if cond is false
type Ok func(cond bool, v ...interface{})

// No fails if err is present
type No func(err error)

// Assert returns assertion functions for the given testing.TB instance.
func Assert(t testing.TB) (Eq, Ok, No) {
	eq := func(actual, expected interface{}) {
		if !reflect.DeepEqual(expected, actual) {
			_, file, line, _ := runtime.Caller(1)
			fmt.Printf("%s:%d:\n\nwant: %#v\n\ngot: %#v\n\n", filepath.Base(file), line, expected, actual)
			t.FailNow()
		}
	}

	ok := func(cond bool, v ...interface{}) {
		if !cond {
			_, file, line, _ := runtime.Caller(1)
			var msg string
			if len(v) > 0 {
				msg = fmt.Sprintf("%v", v)
			} else {
				msg = "fail"
			}
			fmt.Printf("%s:%d: %v\n\n", filepath.Base(file), line, msg)
			t.FailNow()
		}
	}

	no := func(err error) {
		if err != nil {
			_, file, line, _ := runtime.Caller(1)
			fmt.Printf("%s:%d: unexpected: %s\n\n", filepath.Base(file), line, err.Error())
			t.FailNow()
		}
	}

	return eq, ok, no
}
