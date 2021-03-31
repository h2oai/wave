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
	"os"
	"path/filepath"
	"runtime"
	"strings"

	"github.com/h2oai/wave"
)

const (
	envVarNamePrefix = "H2O_WAVE"
)

var (
	// Version is the executable version.
	Version = "(version)"

	// BuildDate is the executable build date.
	BuildDate = "(build)"
)

func main() {
	// TODO Use github.com/gosidekick/goconfig instead.

	var (
		conf    wave.ServerConf
		version bool
	)

	flag.BoolVar(&version, "version", false, "print version and exit")
	flag.StringVar(&conf.Listen, "listen", ":10101", "listen on this address")
	flag.StringVar(&conf.WebDir, "web-dir", "./www", "directory to serve web assets from")
	flag.StringVar(&conf.DataDir, "data-dir", "./data", "directory to store site data")
	flag.StringVar(&conf.AccessKeyID, "access-key-id", "access_key_id", "default access key ID")
	flag.StringVar(&conf.AccessKeySecret, "access-key-secret", "access_key_secret", "default access key secret")
	flag.StringVar(&conf.Init, "init", "", "initialize site content from AOF log")
	flag.StringVar(&conf.Compact, "compact", "", "compact AOF log")
	flag.StringVar(&conf.CertFile, "tls-cert-file", "", "path to certificate file (TLS only)")
	flag.StringVar(&conf.KeyFile, "tls-key-file", "", "path to private key file (TLS only)")
	flag.BoolVar(&conf.Editable, "editable", false, "allow users to edit web pages")
	flag.StringVar(&conf.MaxRequestSize, "max-request-size", "5M", "maximum allowed size of HTTP requests to the server (e.g. 5M or 5MB or 5MiB)")
	flag.StringVar(&conf.MaxProxyRequestSize, "max-proxy-request-size", "5M", "maximum allowed size of proxied HTTP requests (e.g. 5M or 5MB or 5MiB)")
	flag.StringVar(&conf.MaxProxyResponseSize, "max-proxy-response-size", "5M", "maximum allowed size of proxied HTTP responses (e.g. 5M or 5MB or 5MiB)")
	flag.BoolVar(&conf.Debug, "debug", false, "enable debug mode (profiling, inspection, etc.)")

	const (
		oidcClientID      = "oidc-client-id"
		oidcClientSecret  = "oidc-client-secret"
		oidcProviderURL   = "oidc-provider-url"
		oidcRedirectURL   = "oidc-redirect-url"
		oidcEndSessionURL = "oidc-end-session-url"
	)

	conf.OIDCClientID = os.Getenv(envVarName(oidcClientID))
	flag.StringVar(&conf.OIDCClientID, oidcClientID, conf.OIDCClientID, "OIDC client ID")

	conf.OIDCClientSecret = os.Getenv(envVarName(oidcClientSecret))
	flag.StringVar(&conf.OIDCClientSecret, oidcClientSecret, conf.OIDCClientSecret, "OIDC client secret")

	conf.OIDCProviderURL = os.Getenv(envVarName(oidcProviderURL))
	flag.StringVar(&conf.OIDCProviderURL, oidcProviderURL, conf.OIDCProviderURL, "OIDC provider URL")

	conf.OIDCRedirectURL = os.Getenv(envVarName(oidcRedirectURL))
	flag.StringVar(&conf.OIDCRedirectURL, oidcRedirectURL, conf.OIDCRedirectURL, "OIDC redirect URL")

	conf.OIDCEndSessionURL = os.Getenv(envVarName(oidcEndSessionURL))
	flag.StringVar(&conf.OIDCEndSessionURL, oidcEndSessionURL, conf.OIDCEndSessionURL, "OIDC end session URL")

	flag.Parse()

	if version {
		fmt.Printf("Wave Development Server\nVersion %s Build %s (%s/%s)\nCopyright (c) H2O.ai, Inc.\n", Version, BuildDate, runtime.GOOS, runtime.GOARCH)
		return
	}

	conf.WebDir, _ = filepath.Abs(conf.WebDir)
	conf.DataDir, _ = filepath.Abs(conf.DataDir)

	conf.Version = Version
	conf.BuildDate = BuildDate

	wave.Run(conf)
}

func envVarName(n string) string {
	envVar := strings.ToUpper(strings.ReplaceAll(n, "-", "_"))
	return fmt.Sprintf("%s_%s", envVarNamePrefix, envVar)
}
