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
	"errors"
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
	// TODO Use github.com/gosidekick/goconfig instead.

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
	flag.StringVar(&conf.Listen, "listen", ":10101", "listen on this address")
	flag.StringVar(&conf.WebDir, "web-dir", "./www", "directory to serve web assets from")
	flag.StringVar(&conf.DataDir, "data-dir", "./data", "directory to store site data")
	flag.StringVar(&accessKeyID, "access-key-id", "access_key_id", "default API access key ID")
	flag.StringVar(&accessKeySecret, "access-key-secret", "access_key_secret", "default API access key secret")
	flag.StringVar(&accessKeyFile, "access-keychain", ".wave-keychain", "path to file containing API access keys")
	flag.BoolVar(&createAccessKey, "create-access-key", false, "generate and add a new API access key ID and secret pair to the keychain")
	flag.BoolVar(&listAccessKeys, "list-access-keys", false, "list all the access key IDs in the keychain")
	flag.StringVar(&removeAccessKeyID, "remove-access-key", "", "remove the specified API access key ID from the keychain")
	flag.StringVar(&conf.Init, "init", "", "initialize site content from AOF log")
	flag.StringVar(&conf.Compact, "compact", "", "compact AOF log")
	flag.StringVar(&conf.CertFile, "tls-cert-file", "", "path to certificate file (TLS only)")
	flag.StringVar(&conf.KeyFile, "tls-key-file", "", "path to private key file (TLS only)")
	flag.BoolVar(&conf.Editable, "editable", false, "allow users to edit web pages")
	flag.StringVar(&maxRequestSize, "max-request-size", "5M", "maximum allowed size of HTTP requests to the server (e.g. 5M or 5MB or 5MiB)")
	flag.StringVar(&maxCacheRequestSize, "max-cache-request-size", "5M", "maximum allowed size of HTTP requests to the server cache (e.g. 5M or 5MB or 5MiB)")
	flag.BoolVar(&conf.Proxy, "proxy", false, "enable HTTP proxy (for IDE / language server support only - not recommended for internet-facing websites)")
	flag.StringVar(&maxProxyRequestSize, "max-proxy-request-size", "5M", "maximum allowed size of proxied HTTP requests (e.g. 5M or 5MB or 5MiB)")
	flag.StringVar(&maxProxyResponseSize, "max-proxy-response-size", "5M", "maximum allowed size of proxied HTTP responses (e.g. 5M or 5MB or 5MiB)")
	// TODO enable when IDE is released
	// flag.BoolVar(&conf.IDE, "ide", false, "enable Wave IDE (experimental)")
	flag.BoolVar(&conf.Debug, "debug", false, "enable debug mode (profiling, inspection, etc.)")

	const (
		oidcClientID      = "oidc-client-id"
		oidcClientSecret  = "oidc-client-secret"
		oidcProviderURL   = "oidc-provider-url"
		oidcRedirectURL   = "oidc-redirect-url"
		oidcEndSessionURL = "oidc-end-session-url"
		oidcScopes        = "oidc-scopes"
		oidcSkipLogin     = "oidc-skip-login"
	)

	auth.ClientID = os.Getenv(toEnvVar(oidcClientID))
	flag.StringVar(&auth.ClientID, oidcClientID, auth.ClientID, "OIDC client ID")

	auth.ClientSecret = os.Getenv(toEnvVar(oidcClientSecret))
	flag.StringVar(&auth.ClientSecret, oidcClientSecret, auth.ClientSecret, "OIDC client secret")

	auth.ProviderURL = os.Getenv(toEnvVar(oidcProviderURL))
	flag.StringVar(&auth.ProviderURL, oidcProviderURL, auth.ProviderURL, "OIDC provider URL")

	auth.RedirectURL = os.Getenv(toEnvVar(oidcRedirectURL))
	flag.StringVar(&auth.RedirectURL, oidcRedirectURL, auth.RedirectURL, "OIDC redirect URL")

	auth.EndSessionURL = os.Getenv(toEnvVar(oidcEndSessionURL))
	flag.StringVar(&auth.EndSessionURL, oidcEndSessionURL, auth.EndSessionURL, "OIDC end session URL")

	scopes = os.Getenv(toEnvVar(oidcScopes))
	flag.StringVar(&scopes, oidcScopes, scopes, "OIDC scopes separated by comma (default \"openid,profile\")")

	auth.SkipLogin = getEnvBool(toEnvVar(oidcSkipLogin))
	flag.BoolVar(&auth.SkipLogin, oidcSkipLogin, auth.SkipLogin, "don't show the login form during OIDC authorization")

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

	conf.MaxRequestSize, err = parseReadSize("max request size", maxRequestSize)
	if err != nil {
		panic(err)
	}

	conf.MaxCacheRequestSize, err = parseReadSize("max cache request size", maxCacheRequestSize)
	if err != nil {
		panic(err)
	}

	conf.MaxProxyRequestSize, err = parseReadSize("max proxy request size", maxProxyRequestSize)
	if err != nil {
		panic(err)
	}

	conf.MaxProxyResponseSize, err = parseReadSize("max proxy response size", maxProxyResponseSize)
	if err != nil {
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

func toEnvVar(name string) string {
	return fmt.Sprintf("H2O_WAVE_%s", strings.ToUpper(strings.ReplaceAll(name, "-", "_")))
}

func getEnvBool(name string) bool {
	s, ok := os.LookupEnv(name)
	if !ok {
		return false
	}
	v, err := strconv.ParseBool(strings.ToLower(s))
	if err != nil {
		panic(fmt.Errorf("invalid setting for environment variable %s: %v", name, err))
	}
	return v
}

var (
	errMaxReadSizeTooLarge = errors.New("size too large (want <= max int64)")
)

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
