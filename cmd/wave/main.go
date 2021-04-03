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
	"strconv"
	"strings"

	"github.com/h2oai/wave"
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
		version              bool
		maxRequestSize       string
		maxCacheRequestSize  string
		maxProxyRequestSize  string
		maxProxyResponseSize string
		accessKeyID          string
		accessKeySecret      string
		accessKeyFile        string
		createAccessKey      bool
		removeAccessKey      bool
	)

	flag.BoolVar(&version, "version", false, "print version and exit")
	flag.StringVar(&conf.Listen, "listen", ":10101", "listen on this address")
	flag.StringVar(&conf.WebDir, "web-dir", "./www", "directory to serve web assets from")
	flag.StringVar(&conf.DataDir, "data-dir", "./data", "directory to store site data")
	flag.StringVar(&accessKeyID, "access-key-id", "access_key_id", "default app access key ID")
	flag.StringVar(&accessKeySecret, "access-key-secret", "access_key_secret", "default app access key secret")
	flag.StringVar(&accessKeyFile, "access-keychain", ".wave-keychain", "path to file containing app access keys")
	flag.BoolVar(&createAccessKey, "create-access-key", false, "generate and add a new app access key ID and secret pair to the keychain")
	flag.BoolVar(&removeAccessKey, "remove-access-key", false, "remove an app access key from the keychain")
	flag.StringVar(&conf.Init, "init", "", "initialize site content from AOF log")
	flag.StringVar(&conf.Compact, "compact", "", "compact AOF log")
	flag.StringVar(&conf.CertFile, "tls-cert-file", "", "path to certificate file (TLS only)")
	flag.StringVar(&conf.KeyFile, "tls-key-file", "", "path to private key file (TLS only)")
	flag.BoolVar(&conf.Editable, "editable", false, "allow users to edit web pages")
	flag.StringVar(&maxRequestSize, "max-request-size", "5M", "maximum allowed size of HTTP requests to the server (e.g. 5M or 5MB or 5MiB)")
	flag.StringVar(&maxCacheRequestSize, "max-cache-request-size", "5M", "maximum allowed size of HTTP requests to the server cache (e.g. 5M or 5MB or 5MiB)")
	flag.StringVar(&maxProxyRequestSize, "max-proxy-request-size", "5M", "maximum allowed size of proxied HTTP requests (e.g. 5M or 5MB or 5MiB)")
	flag.StringVar(&maxProxyResponseSize, "max-proxy-response-size", "5M", "maximum allowed size of proxied HTTP responses (e.g. 5M or 5MB or 5MiB)")
	flag.BoolVar(&conf.Debug, "debug", false, "enable debug mode (profiling, inspection, etc.)")

	const (
		oidcClientID      = "oidc-client-id"
		oidcClientSecret  = "oidc-client-secret"
		oidcProviderURL   = "oidc-provider-url"
		oidcRedirectURL   = "oidc-redirect-url"
		oidcEndSessionURL = "oidc-end-session-url"
		oidcSkipLogin     = "oidc-skip-login"
	)

	conf.OIDCClientID = os.Getenv(toEnvVar(oidcClientID))
	flag.StringVar(&conf.OIDCClientID, oidcClientID, conf.OIDCClientID, "OIDC client ID")

	conf.OIDCClientSecret = os.Getenv(toEnvVar(oidcClientSecret))
	flag.StringVar(&conf.OIDCClientSecret, oidcClientSecret, conf.OIDCClientSecret, "OIDC client secret")

	conf.OIDCProviderURL = os.Getenv(toEnvVar(oidcProviderURL))
	flag.StringVar(&conf.OIDCProviderURL, oidcProviderURL, conf.OIDCProviderURL, "OIDC provider URL")

	conf.OIDCRedirectURL = os.Getenv(toEnvVar(oidcRedirectURL))
	flag.StringVar(&conf.OIDCRedirectURL, oidcRedirectURL, conf.OIDCRedirectURL, "OIDC redirect URL")

	conf.OIDCEndSessionURL = os.Getenv(toEnvVar(oidcEndSessionURL))
	flag.StringVar(&conf.OIDCEndSessionURL, oidcEndSessionURL, conf.OIDCEndSessionURL, "OIDC end session URL")

	conf.OIDCSkipLogin = getEnvBool(toEnvVar(oidcSkipLogin))
	flag.BoolVar(&conf.OIDCSkipLogin, oidcSkipLogin, conf.OIDCSkipLogin, "don't show the login form during OIDC authorization")

	flag.Parse()

	if version {
		fmt.Printf("Wave Daemon\nVersion %s Build %s (%s/%s)\nCopyright (c) H2O.ai, Inc.\n", Version, BuildDate, runtime.GOOS, runtime.GOARCH)
		return
	}

	keychain, err := wave.LoadKeychain(accessKeyFile)
	if err != nil {
		panic(fmt.Errorf("failed loading keychain: %v", err))
	}

	if removeAccessKey {
		if _, ok := keychain[accessKeyID]; !ok {
			fmt.Printf("error: access key ID %s not found in keychain %s\n", accessKeyID, accessKeyFile)
			os.Exit(1)
		}

		delete(keychain, accessKeyID)
		if wave.DumpKeychain(keychain, accessKeyFile); err != nil {
			panic(fmt.Errorf("failed writing keychain: %v", err))
		}
		fmt.Printf("Success! Key %s removed from keychain %s\n", accessKeyID, accessKeyFile)
		return
	}

	if createAccessKey {
		id, secret, hash, err := wave.CreateAccessKey()
		if err != nil {
			panic(fmt.Errorf("failed generating access key: %v", err))
		}
		keychain[id] = hash
		if wave.DumpKeychain(keychain, accessKeyFile); err != nil {
			panic(fmt.Errorf("failed writing keychain: %v", err))
		}
		fmt.Printf(createAccessKeyMessage, id, secret, accessKeyFile)
		return
	}

	if len(keychain) == 0 {
		hash, err := wave.HashSecret(accessKeySecret)
		if err != nil {
			panic(err)
		}
		keychain[accessKeyID] = hash
	}

	conf.Keychain = keychain

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

	// TODO perform init and compact here instead of inside Run(); rename Run() to Listen()

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
