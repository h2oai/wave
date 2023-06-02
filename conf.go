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

package wave

import (
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"reflect"
	"strconv"
	"strings"
	"time"

	"github.com/h2oai/goconfig"
	"github.com/h2oai/wave/pkg/keychain"
	"github.com/joho/godotenv"
)

// ServerConf represents Server configuration options.
type ServerConf struct {
	Version              string
	BuildDate            string
	Listen               string
	BaseURL              string
	WebDir               string
	DataDir              string
	PublicDirs           []string
	PrivateDirs          []string
	Keychain             *keychain.Keychain
	Init                 string
	Compact              string
	CertFile             string
	SkipCertVerification bool
	KeyFile              string
	Header               http.Header
	Editable             bool
	MaxRequestSize       int64
	MaxCacheRequestSize  int64
	Proxy                bool
	MaxProxyRequestSize  int64
	MaxProxyResponseSize int64
	NoStore              bool
	NoLog                bool
	IDE                  bool
	Debug                bool
	Auth                 *AuthConf
	ForwardedHeaders     map[string]bool
}

type AuthConf struct {
	ClientID              string
	ClientSecret          string
	ProviderURL           string
	RedirectURL           string
	EndSessionURL         string
	PostLogoutRedirectURL string
	Scopes                []string
	URLParameters         [][]string
	SkipLogin             bool
	SessionExpiry         time.Duration
	InactivityTimeout     time.Duration
}

type Conf struct {
	Version               bool   `cfg:"version" cfgDefault:"false"`
	Listen                string `cfg:"listen" cfgDefault:":10101" cfgHelper:"listen on this address"`
	BaseUrl               string `cfg:"base-url" cfgDefault:"/" cfgHelper:"the base URL (path prefix) to be used for resolving relative URLs (e.g. /foo/ or /foo/bar/, without the host)"`
	WebDir                string `cfg:"web-dir" cfgDefault:"./www" cfgHelper:"directory to serve web assets from, hosted at /"`
	DataDir               string `cfg:"data-dir" cfgDefault:"./data" cfgHelper:"directory to store site data"`
	PublicDirs            string `cfg:"public-dir" cfgDefault:"" cfgHelper:"additional directory to serve files from, in the format \"[url-path]@[filesystem-path]\", e.g. \"/public/files/@/some/local/path\" will host /some/local/path/foo.txt at /public/files/foo.txt; multiple directory mappings allowed"`
	PrivateDirs           string `cfg:"private-dirl" cfgDefault:"" cfgHelper:"additional directory to serve files from (authenticated users only), in the format \"[url-path]@[filesystem-path]\", e.g. \"/public/files/@/some/local/path\" will host /some/local/path/foo.txt at /public/files/foo.txt; multiple directory mappings allowed"`
	AccessKeyID           string `cfg:"access-key-id" cfgDefault:"access_key_id" cfgHelper:"default API access key ID"`
	AccessKeySecret       string `cfg:"access-key-secret" cfgDefault:"access_key_secret" cfgHelper:"default API access key secret"`
	AccessKeyFile         string `cfg:"access-keychain" cfgDefault:".wave-keychain" cfgHelper:"path to file containing API access keys"`
	CreateAccessKey       bool   `cfg:"create-access-key" cfgDefault:"false" cfgHelper:"generate and add a new API access key ID and secret pair to the keychain"`
	ListAccessKeys        bool   `cfg:"list-access-keys" cfgDefault:"false" cfgHelper:"list all the access key IDs in the keychain"`
	RemoveAccessKeyID     string `cfg:"remove-access-key" cfgDefault:"" cfgHelper:"remove the specified API access key ID from the keychain"`
	Init                  string `cfg:"init" cfgDefault:"" cfgHelper:"initialize site content from AOF log"`
	Compact               string `cfg:"compact" cfgDefault:"" cfgHelper:"compact AOF log"`
	CertFile              string `cfg:"tls-cert-file" cfgDefault:"" cfgHelper:"path to certificate file (TLS only)"`
	KeyFile               string `cfg:"tls-key-file" cfgDefault:"" cfgHelper:"path to private key file (TLS only)"`
	SkipCertVerification  bool   `cfg:"no-tls-verify" cfgDefault:"false" cfgHelper:"do not verify TLS certificates during external communication - DO NOT USE IN PRODUCTION"`
	HttpHeadersFile       string `cfg:"http-headers-file" cfgDefault:"" cfgHelper:"path to a MIME-formatted file containing additional HTTP headers to add to responses from the server"`
	ForwardedHttpHeaders  string `cfg:"forwarded-http-headers" cfgDefault:"*" cfgHelper:"comma-separated list of case insesitive HTTP header keys to forward to the Wave app from the browser WS connection. If not specified, defaults to '*' - all headers are allowed. If set to an empty string, no headers are forwarded."`
	Editable              bool   `cfg:"editable" cfgDefault:"false" cfgHelper:"allow users to edit web pages"`
	MaxRequestSize        string `cfg:"max-request-size" cfgDefault:"5M" cfgHelper:"maximum allowed size of HTTP requests to the server (e.g. 5M or 5MB or 5MiB)"`
	MaxCacheRequestSize   string `cfg:"max-cache-request-size" cfgDefault:"5M" cfgHelper:"maximum allowed size of HTTP requests to the server cache (e.g. 5M or 5MB or 5MiB)"`
	Proxy                 bool   `cfg:"proxy" cfgDefault:"false" cfgHelper:"enable HTTP proxy (for IDE / language server support only - not recommended for internet-facing websites)"`
	MaxProxyRequestSize   string `cfg:"max-proxy-request-size" cfgDefault:"5M" cfgHelper:"maximum allowed size of proxied HTTP requests (e.g. 5M or 5MB or 5MiB)"`
	MaxProxyResponseSize  string `cfg:"max-proxy-response-size" cfgDefault:"5M" cfgHelper:"maximum allowed size of proxied HTTP responses (e.g. 5M or 5MB or 5MiB)"`
	SessionExpiry         string `cfg:"session-expiry" cfgDefault:"720h" cfgHelper:"session cookie lifetime duration (e.g. 1800s or 30m or 0.5h)"`
	InactivityTimeout     string `cfg:"session-inactivity-timeout" cfgDefault:"30m" cfgHelper:"session inactivity timeout duration (e.g. 1800s or 30m or 0.5h)"`
	NoStore               bool   `cfg:"no-store" cfgDefault:"false" cfgHelper:"disable storage (scripts and multicast/broadcast apps will not work)"`
	NoLog                 bool   `cfg:"no-log" cfgDefault:"false" cfgHelper:"disable AOF logging (connect/disconnect and diagnostic logging messages are not disabled)"`
	Debug                 bool   `cfg:"debug" cfgDefault:"false" cfgHelper:"enable debug mode (profiling, inspection, etc.)"`
	ClientID              string `cfg:"oidc-client-id" cfgDefault:"" cfgHelper:"OIDC client ID"`
	ClientSecret          string `cfg:"oidc-client-secret" cfgDefault:"" cfgHelper:"OIDC client secret"`
	ProviderUrl           string `cfg:"oidc-provider-url" cfgDefault:"" cfgHelper:"OIDC provider URL"`
	RedirectUrl           string `cfg:"oidc-redirect-url" cfgDefault:"" cfgHelper:"OIDC redirect URL"`
	EndSessionUrl         string `cfg:"oidc-end-session-url" cfgDefault:"" cfgHelper:"OIDC end session URL"`
	PostLogoutRedirectUrl string `cfg:"oidc-post-logout-redirect-url" cfgDefault:"" cfgHelper:"OIDC post logout redirect URL"`
	RawAuthScopes         string `cfg:"oidc-scopes" cfgDefault:"openid,profile" cfgHelper:"OIDC scopes, comma-separated (default \"openid,profile\")"`
	RawAuthURLParams      string `cfg:"oidc-auth-url-params" cfgDefault:"" cfgHelper:"additional URL parameters to pass during OIDC authorization, in the format \"key:value\", comma-separated, e.g. \"foo:bar,qux:42\""`
	SkipLogin             bool   `cfg:"oidc-skip-login" cfgDefault:"false" cfgHelper:"do not display the login form during OIDC authorization"`
	Conf                  string `cfg:"conf" cfgDefault:".env" cfgHelper:"path to configuration file"`
}

func LoadEnv(config interface{}) error {
	configFile := filepath.Join(goconfig.Path, goconfig.File)

	if _, err := os.Stat(configFile); os.IsNotExist(err) {
		// If config does not exist, just continue.
		return nil
	}

	dotEnvMap, err := godotenv.Read(configFile)
	if err != nil {
		return err
	}

	// Format .env file keys.
	for k, v := range dotEnvMap {
		delete(dotEnvMap, k)
		if strings.HasPrefix(k, goconfig.PrefixEnv) {
			k = strings.TrimPrefix(k, goconfig.PrefixEnv+"_")
		}
		// Wave uses dashes instead of underscores.
		k = strings.ReplaceAll(k, "_", "-")
		dotEnvMap[strings.ToLower(k)] = v
	}

	configType := reflect.TypeOf(config).Elem()
	configValue := reflect.ValueOf(config).Elem()

	for i := 0; i < configType.NumField(); i++ {
		field := configType.Field(i)
		tag := field.Tag.Get("cfg")
		if tag == "" {
			continue
		}
		value, ok := dotEnvMap[tag]
		if !ok {
			continue
		}
		switch field.Type.Kind() {
		case reflect.String:
			configValue.Field(i).SetString(value)
		case reflect.Int:
			intValue, err := strconv.Atoi(value)
			if err != nil {
				return fmt.Errorf("failed to parse int value for field %s: %v", field.Name, err)
			}
			configValue.Field(i).SetInt(int64(intValue))
		case reflect.Bool:
			boolValue, err := strconv.ParseBool(value)
			if err != nil {
				return fmt.Errorf("failed to parse bool value for field %s: %v", field.Name, err)
			}
			configValue.Field(i).SetBool(boolValue)
		default:
			return fmt.Errorf("unsupported field type: %v", field.Type.Kind())
		}
	}

	return nil
}

func PrepareHelp(config interface{}) (string, error) {
	var helpAux []byte
	configValue := reflect.ValueOf(config).Elem()
	for i := 0; i < configValue.NumField(); i++ {
		if configValue.Field(i).Kind() == reflect.Struct {
			nestedHelp, err := PrepareHelp(configValue.Field(i).Addr().Interface())
			if err != nil {
				return "", err
			}
			helpAux = append(helpAux, []byte(nestedHelp)...)
			continue
		}
		fieldType := configValue.Type().Field(i)
		fieldTag := fieldType.Tag.Get("cfg")
		if fieldTag == "-" {
			continue
		}
		if fieldTag == "" {
			fieldTag = fieldType.Name
		}
		var snakeCase []byte
		for i, c := range fieldTag {
			if i > 0 && c >= 'A' && c <= 'Z' {
				snakeCase = append(snakeCase, '_')
			}
			snakeCase = append(snakeCase, byte(c))
		}
		prefix := ""
		if goconfig.PrefixEnv != "" {
			prefix = goconfig.PrefixEnv + "_"
		}
		helpAux = append(helpAux, []byte(prefix+strings.ToUpper(string(snakeCase)))...)
		helpAux = append(helpAux, []byte("=value\n")...)
	}
	return string(helpAux), nil
}
