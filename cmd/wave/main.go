package main

import (
	"flag"
	"fmt"
	"path/filepath"
	"runtime"

	"github.com/h2oai/wave"
)

var (
	// Version is the executable version.
	Version = "(version)"

	// BuildDate is the executable build date.
	BuildDate = "(build)"
)

func main() {
	// TODO https://github.com/urfave/cli/blob/master/docs/v2/manual.md

	var (
		conf    wave.ServerConf
		version bool
	)

	flag.BoolVar(&version, "version", false, "print version and exit")
	flag.StringVar(&conf.Listen, "listen", ":55555", "listen on this address")
	flag.StringVar(&conf.WebDir, "web-dir", "./www", "directory to serve web assets from")
	flag.StringVar(&conf.DataDir, "data-dir", "./data", "directory to store site data")
	flag.StringVar(&conf.AccessKeyID, "access-key-id", "access_key_id", "default access key ID")
	flag.StringVar(&conf.AccessKeySecret, "access-key-secret", "access_key_secret", "default access key secret")
	flag.StringVar(&conf.Init, "init", "", "initialize site content from AOF log")
	flag.StringVar(&conf.Compact, "compact", "", "compact AOF log")
	flag.StringVar(&conf.CertFile, "tls-cert-file", "", "path to certificate file (TLS only)")
	flag.StringVar(&conf.KeyFile, "tls-key-file", "", "path to private key file (TLS only)")
	flag.BoolVar(&conf.Debug, "debug", false, "enable debug mode (profiling, inspection, etc.)")
	flag.StringVar(&conf.OIDCClientID, "oidc-client-id", "", "OIDC client ID")
	flag.StringVar(&conf.OIDCClientSecret, "oidc-client-secret", "", "OIDC client secret")
	flag.StringVar(&conf.OIDCProviderURL, "oidc-provider-url", "", "OIDC provider URL")
	flag.StringVar(&conf.OIDCRedirectURL, "oidc-redirect-url", "", "OIDC redirect URL")
	flag.StringVar(&conf.OIDCEndSessionURL, "oidc-end-session-url", "", "OIDC end session URL")

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
