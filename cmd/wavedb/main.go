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

package main

import (
	"flag"
	"fmt"
	"runtime"

	// Blank import of "crypto/tls/fipsonly" enforces that only FIPS-approved algorithms
	// are used for TLS.
	// Package is only available only when GOEXPERIMENT=boringcrypto is set.
	// We do not hide the import behind a build tag so that we enforce that the binary is built with
	// the boring crypto experiment enabled.
	_ "crypto/tls/fipsonly"

	"github.com/h2oai/wave/pkg/db"
	"github.com/h2oai/wave/pkg/keychain"
)

var (
	// Version is the executable version.
	Version = "(version)"

	// BuildDate is the executable build date.
	BuildDate = "(build)"
)

func main() {

	// Limit to 1 CPU:
	// - Theoretically unlimited read concurrency in WAL mode (enabled by default).
	// - Write concurrency is unaffected by num CPUs.
	runtime.GOMAXPROCS(1)

	var (
		conf            db.DSConf
		version         bool
		accessKeyID     string
		accessKeySecret string
		accessKeyFile   string
		iterations      int
	)

	flag.BoolVar(&version, "version", false, "print version and exit")
	flag.StringVar(&conf.Listen, "listen", ":10100", "listen on this address")
	flag.StringVar(&conf.Dir, "dir", ".", "path to directory containing database (.db) files")
	flag.StringVar(&conf.CertFile, "tls-cert-file", "", "path to certificate file (TLS only)")
	flag.StringVar(&conf.KeyFile, "tls-key-file", "", "path to private key file (TLS only)")
	flag.StringVar(&accessKeyID, "access-key-id", "access_key_id", "default API access key ID")
	flag.StringVar(&accessKeySecret, "access-key-secret", "access_key_secret", "default API access key secret")
	flag.StringVar(&accessKeyFile, "access-keychain", ".wave-keychain", "path to file containing API access keys")
	flag.BoolVar(&conf.Verbose, "verbose", false, "enable verbose logging")
	flag.IntVar(&iterations, "benchmark", 0, "run benchmarks for the given number of iterations")

	flag.Parse()

	if version {
		fmt.Printf("WaveDB\nVersion %s Build %s (%s/%s)\nCopyright (c) H2O.ai, Inc.\n", Version, BuildDate, runtime.GOOS, runtime.GOARCH)
		return
	}

	if iterations > 0 {
		db.Benchmark(iterations, conf.Verbose)
		return
	}

	kc, err := keychain.LoadKeychain(accessKeyFile)
	if err != nil {
		panic(fmt.Errorf("failed loading keychain: %v", err))
	}

	if kc.Len() == 0 {
		if len(accessKeyID) == 0 || len(accessKeySecret) == 0 {
			panic("default access key ID or secret cannot be empty")
		}
		hash, err := keychain.HashSecret(accessKeySecret)
		if err != nil {
			panic(err)
		}
		kc.Add(accessKeyID, hash)
	}

	conf.Version = Version
	conf.BuildDate = BuildDate
	conf.Keychain = kc

	db.Run(conf)
}
