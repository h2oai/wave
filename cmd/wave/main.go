package main

import (
	"flag"
	"fmt"
	"github.com/h2oai/wave"
	"os"
	"path/filepath"
	"runtime"
	"strconv"
	"strings"
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
	// TODO https://github.com/urfave/cli/blob/master/docs/v2/manual.md

	var (
		conf    wave.ServerConf
		version bool
	)

	boolFlagWithDefault(&version, "version", false, "print version and exit")
	stringFlagWithDefault(&conf.Listen, "listen", ":55555", "listen on this address")
	stringFlagWithDefault(&conf.WebDir, "web-dir", "./www", "directory to serve web assets from")
	stringFlagWithDefault(&conf.DataDir, "data-dir", "./data", "directory to store site data")
	stringFlagWithDefault(&conf.AccessKeyID, "access-key-id", "access_key_id", "default access key ID")
	stringFlagWithDefault(&conf.AccessKeySecret, "access-key-secret", "access_key_secret", "default access key secret")
	stringFlagWithDefault(&conf.Init, "init", "", "initialize site content from AOF log")
	stringFlagWithDefault(&conf.Compact, "compact", "", "compact AOF log")
	stringFlagWithDefault(&conf.CertFile, "tls-cert-file", "", "path to certificate file (TLS only)")
	stringFlagWithDefault(&conf.KeyFile, "tls-key-file", "", "path to private key file (TLS only)")
	boolFlagWithDefault(&conf.Debug, "debug", false, "enable debug mode (profiling, inspection, etc.)")
	stringFlagWithDefault(&conf.OIDCClientID, "oidc-client-id", "", "OIDC client ID")
	stringFlagWithDefault(&conf.OIDCClientSecret, "oidc-client-secret", "", "OIDC client secret")
	stringFlagWithDefault(&conf.OIDCProviderURL, "oidc-provider-url", "", "OIDC provider URL")
	stringFlagWithDefault(&conf.OIDCRedirectURL, "oidc-redirect-url", "", "OIDC redirect URL")
	stringFlagWithDefault(&conf.OIDCEndSessionURL, "oidc-end-session-url", "", "OIDC end session URL")

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

func stringFlagWithDefault(p *string, name string, defaultValue string, usage string) {
	flag.StringVar(p, name, lookupStringEnv(envVarName(name), defaultValue), usage)
}

func boolFlagWithDefault(p *bool, name string, defaultValue bool, usage string) {
	envVal, err := lookupBoolEnv(envVarName(name), defaultValue)
	if err != nil {
		panic(err)
	}
	flag.BoolVar(p, name, envVal, usage)
}

func envVarName(n string) string {
	envVar := strings.ToUpper(strings.ReplaceAll(n, "-", "_"))
	return fmt.Sprintf("%s_%s", envVarNamePrefix, envVar)
}

func lookupStringEnv(name string, defaultValue string) string {
	val, found := os.LookupEnv(name)
	if !found {
		return defaultValue
	}
	return val
}

func lookupBoolEnv(name string, defaultValue bool) (bool, error) {
	rawVal, found := os.LookupEnv(name)
	if !found {
		return defaultValue, nil
	}
	val, err := strconv.ParseBool(rawVal)
	if err != nil {
		return false, fmt.Errorf("failed parsing %s: %v", name, err)
	}
	return val, nil
}
