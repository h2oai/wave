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

	"github.com/h2oai/wave/pkg/db"
	"github.com/h2oai/wave/pkg/keychain"
)

func main() {

	var (
		conf            db.DSConf
		accessKeyID     string
		accessKeySecret string
		accessKeyFile   string
	)

	flag.StringVar(&conf.Listen, "listen", ":10100", "listen on this address")
	flag.StringVar(&conf.CertFile, "tls-cert-file", "", "path to certificate file (TLS only)")
	flag.StringVar(&conf.KeyFile, "tls-key-file", "", "path to private key file (TLS only)")
	flag.StringVar(&accessKeyID, "access-key-id", "access_key_id", "default API access key ID")
	flag.StringVar(&accessKeySecret, "access-key-secret", "access_key_secret", "default API access key secret")
	flag.StringVar(&accessKeyFile, "access-keychain", ".wave-keychain", "path to file containing API access keys")

	flag.Parse()

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

	db.NewDS(kc).Run(conf)
}
