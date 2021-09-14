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
	"math"
	"os"
	"path/filepath"
	"runtime"
	"sort"
	"strconv"
	"strings"

	"github.com/h2oai/wave"
	"github.com/h2oai/wave/pkg/keychain"
)

var (
	// Version is the executable version.
	Version = "(version)"

	// BuildDate is the executable build date.
	BuildDate = "(build)"
)

const (
	createAccessKeyMessage = `
SUCCESS!

Make sure to copy your new access key ID and secret now.
You won't be able to see it again!

H2O_WAVE_ACCESS_KEY_ID=%s
H2O_WAVE_ACCESS_KEY_SECRET=%s

Your key was also added to the keychain located at
%s

`
)

func main() {
	var (
		conf                 wave.ServerConf
		auth                 wave.AuthConf
		version              bool
		maxRequestSize       string
		maxCacheRequestSize  string
		maxProxyRequestSize  string
		maxProxyResponseSize string
		accessKeyID          string
		accessKeySecret      string
		accessKeyFile        string
		createAccessKey      bool
		listAccessKeys       bool
		removeAccessKeyID    string
		scopes               string
	)

	flag.BoolVar(&version, "version", false, "print version and exit")
	stringVar(&conf.Listen, "listen", ":10101", "listen on this address")
	stringVar(&conf.WebDir, "web-dir", "./www", "directory to serve web assets from, hosted at /")
	stringVar(&conf.DataDir, "data-dir", "./data", "directory to store site data")
	stringsVar(&conf.PublicDirs, "public-dir", "additional directory to serve files from, in the format \"[url-path]@[filesystem-path]\", e.g. \"/public/files/@/some/local/path\" will host /some/local/path/foo.txt at /public/files/foo.txt; multiple directory mappings allowed")
	stringsVar(&conf.PrivateDirs, "private-dir", "additional directory to serve files from (authenticated users only), in the format \"[url-path]@[filesystem-path]\", e.g. \"/public/files/@/some/local/path\" will host /some/local/path/foo.txt at /public/files/foo.txt; multiple directory mappings allowed")
	stringVar(&accessKeyID, "access-key-id", "access_key_id", "default API access key ID")
	stringVar(&accessKeySecret, "access-key-secret", "access_key_secret", "default API access key secret")
	stringVar(&accessKeyFile, "access-keychain", ".wave-keychain", "path to file containing API access keys")
	flag.BoolVar(&createAccessKey, "create-access-key", false, "generate and add a new API access key ID and secret pair to the keychain")
	flag.BoolVar(&listAccessKeys, "list-access-keys", false, "list all the access key IDs in the keychain")
	flag.StringVar(&removeAccessKeyID, "remove-access-key", "", "remove the specified API access key ID from the keychain")
	stringVar(&conf.Init, "init", "", "initialize site content from AOF log")
	flag.StringVar(&conf.Compact, "compact", "", "compact AOF log")
	stringVar(&conf.CertFile, "tls-cert-file", "", "path to certificate file (TLS only)")
	stringVar(&conf.KeyFile, "tls-key-file", "", "path to private key file (TLS only)")
	boolVar(&conf.Editable, "editable", false, "allow users to edit web pages")
	stringVar(&maxRequestSize, "max-request-size", "5M", "maximum allowed size of HTTP requests to the server (e.g. 5M or 5MB or 5MiB)")
	stringVar(&maxCacheRequestSize, "max-cache-request-size", "5M", "maximum allowed size of HTTP requests to the server cache (e.g. 5M or 5MB or 5MiB)")
	boolVar(&conf.Proxy, "proxy", false, "enable HTTP proxy (for IDE / language server support only - not recommended for internet-facing websites)")
	stringVar(&maxProxyRequestSize, "max-proxy-request-size", "5M", "maximum allowed size of proxied HTTP requests (e.g. 5M or 5MB or 5MiB)")
	stringVar(&maxProxyResponseSize, "max-proxy-response-size", "5M", "maximum allowed size of proxied HTTP responses (e.g. 5M or 5MB or 5MiB)")
	// TODO enable when IDE is released
	// boolVar(&conf.IDE, "ide", false, "enable Wave IDE (experimental)")
	boolVar(&conf.Debug, "debug", false, "enable debug mode (profiling, inspection, etc.)")
	stringVar(&auth.ClientID, "oidc-client-id", "", "OIDC client ID")
	stringVar(&auth.ClientSecret, "oidc-client-secret", "", "OIDC client secret")
	stringVar(&auth.ProviderURL, "oidc-provider-url", "", "OIDC provider URL")
	stringVar(&auth.RedirectURL, "oidc-redirect-url", "", "OIDC redirect URL")
	stringVar(&auth.EndSessionURL, "oidc-end-session-url", "", "OIDC end session URL")
	stringVar(&scopes, "oidc-scopes", "", "OIDC scopes separated by comma (default \"openid,profile\")")
	boolVar(&auth.SkipLogin, "oidc-skip-login", false, "do not display the login form during OIDC authorization")

	flag.Parse()

	auth.Scopes = strings.Split(scopes, ",")

	if version {
		fmt.Printf("Wave Daemon\nVersion %s Build %s (%s/%s)\nCopyright (c) H2O.ai, Inc.\n", Version, BuildDate, runtime.GOOS, runtime.GOARCH)
		return
	}

	if len(conf.Compact) > 0 {
		wave.CompactSite(conf.Compact)
		return
	}

	kc, err := keychain.LoadKeychain(accessKeyFile)
	if err != nil {
		panic(fmt.Errorf("failed loading keychain: %v", err))
	}

	if listAccessKeys {
		keys := kc.IDs()
		sort.Strings(keys)
		for _, key := range keys {
			fmt.Println(key)
		}
		return
	}

	if len(removeAccessKeyID) > 0 {
		if ok := kc.Remove(removeAccessKeyID); !ok {
			fmt.Printf("error: access key ID %s not found in keychain %s\n", removeAccessKeyID, kc.Name)
			os.Exit(1)
		}

		if err := kc.Save(); err != nil {
			panic(fmt.Errorf("failed writing keychain: %v", err))
		}
		fmt.Printf("Success! Key %s removed from keychain %s\n", accessKeyID, kc.Name)
		return
	}

	if createAccessKey {
		id, secret, hash, err := keychain.CreateAccessKey()
		if err != nil {
			panic(fmt.Errorf("failed generating access key: %v", err))
		}
		kc.Add(id, hash)
		if err := kc.Save(); err != nil {
			panic(fmt.Errorf("failed writing keychain: %v", err))
		}
		fmt.Printf(createAccessKeyMessage, id, secret, kc.Name)
		return
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

	if conf.MaxRequestSize, err = parseReadSize("max request size", maxRequestSize); err != nil {
		panic(err)
	}

	if conf.MaxCacheRequestSize, err = parseReadSize("max cache request size", maxCacheRequestSize); err != nil {
		panic(err)
	}

	if conf.MaxProxyRequestSize, err = parseReadSize("max proxy request size", maxProxyRequestSize); err != nil {
		panic(err)
	}

	if conf.MaxProxyResponseSize, err = parseReadSize("max proxy response size", maxProxyResponseSize); err != nil {
		panic(err)
	}

	conf.WebDir, _ = filepath.Abs(conf.WebDir)
	conf.DataDir, _ = filepath.Abs(conf.DataDir)

	conf.Version = Version
	conf.BuildDate = BuildDate

	conf.Keychain = kc

	if auth.ClientID != "" && auth.ClientSecret != "" && auth.ProviderURL != "" && auth.RedirectURL != "" {
		conf.Auth = &auth
	}

	if conf.IDE {
		conf.Proxy = true // IDE won't function without proxy
	}

	wave.Run(conf)
}

func getEnv(key, value string) string {
	if v, ok := os.LookupEnv("H2O_WAVE_" + strings.ToUpper(strings.ReplaceAll(key, "-", "_"))); ok {
		return v
	}
	return value
}

func boolVar(p *bool, key string, value bool, usage string) {
	b := "0"
	if value {
		b = "1"
	}
	v, err := strconv.ParseBool(getEnv(key, b))
	if err != nil {
		v = value
	}
	flag.BoolVar(p, key, v, usage)
}

func stringVar(p *string, key, value, usage string) {
	flag.StringVar(p, key, getEnv(key, value), usage)
}

func stringsVar(p *wave.Strings, key, usage string) {
	vs := getEnv(key, "")
	if len(vs) > 0 {
		for _, v := range strings.Split(vs, string(os.PathListSeparator)) {
			p.Set(v)
		}
	}
	flag.Var(p, key, usage)
}

func parseReadSize(label, value string) (int64, error) {
	n, err := wave.ParseBytes(value)

	if err != nil {
		return 0, fmt.Errorf("failed parsing %s: %v", label, err)
	}

	if n > math.MaxInt64 {
		return 0, fmt.Errorf("%s size too large", label)
	}

	return int64(n), nil
}
