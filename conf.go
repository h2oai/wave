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
	"net/http"
	"time"

	"github.com/h2oai/wave/pkg/keychain"
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
	KeepAppLive          bool
	PingInterval         time.Duration
	ReconnectTimeout     time.Duration
	AllowedOrigins       map[string]bool
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
	Version               bool   `cfg:"version" env:"H2O_WAVE_VERSION" cfgDefault:"false"`
	Listen                string `cfg:"listen" env:"H2O_WAVE_LISTEN" cfgDefault:":10101" cfgHelper:"listen on this address"`
	BaseUrl               string `cfg:"base-url" env:"H2O_WAVE_BASE_URL" cfgDefault:"/" cfgHelper:"the base URL (path prefix) to be used for resolving relative URLs (e.g. /foo/ or /foo/bar/, without the host)"`
	WebDir                string `cfg:"web-dir" env:"H2O_WAVE_WEB_DIR" cfgDefault:"./www" cfgHelper:"directory to serve web assets from, hosted at /"`
	DataDir               string `cfg:"data-dir" env:"H2O_WAVE_DATA_DIR" cfgDefault:"./data" cfgHelper:"directory to store site data"`
	PublicDirs            string `cfg:"public-dir" env:"H2O_WAVE_PUBLIC_DIR" cfgDefault:"" cfgHelper:"additional directory to serve files from, in the format \"[url-path]@[filesystem-path]\", e.g. \"/public/files/@/some/local/path\" will host /some/local/path/foo.txt at /public/files/foo.txt; multiple directory mappings allowed"`
	PrivateDirs           string `cfg:"private-dir" env:"H2O_WAVE_PRIVATE_DIR" cfgDefault:"" cfgHelper:"additional directory to serve files from (authenticated users only), in the format \"[url-path]@[filesystem-path]\", e.g. \"/public/files/@/some/local/path\" will host /some/local/path/foo.txt at /public/files/foo.txt; multiple directory mappings allowed"`
	AccessKeyID           string `cfg:"access-key-id" env:"H2O_WAVE_ACCESS_KEY_ID" cfgDefault:"access_key_id" cfgHelper:"default API access key ID"`
	AccessKeySecret       string `cfg:"access-key-secret" env:"H2O_WAVE_ACCESS_KEY_SECRET" cfgDefault:"access_key_secret" cfgHelper:"default API access key secret"`
	AccessKeyFile         string `cfg:"access-keychain" env:"H2O_WAVE_ACCESS_KEYCHAIN" cfgDefault:".wave-keychain" cfgHelper:"path to file containing API access keys"`
	CreateAccessKey       bool   `cfg:"create-access-key" env:"H2O_WAVE_CREATE_ACCESS_KEY" cfgDefault:"false" cfgHelper:"generate and add a new API access key ID and secret pair to the keychain"`
	ListAccessKeys        bool   `cfg:"list-access-keys" env:"H2O_WAVE_LIST_ACCESS_KEYS" cfgDefault:"false" cfgHelper:"list all the access key IDs in the keychain"`
	RemoveAccessKeyID     string `cfg:"remove-access-key" env:"H2O_WAVE_REMOVE_ACCESS_KEY" cfgDefault:"" cfgHelper:"remove the specified API access key ID from the keychain"`
	Init                  string `cfg:"init" env:"H2O_WAVE_INIT" cfgDefault:"" cfgHelper:"initialize site content from AOF log"`
	Compact               string `cfg:"compact" env:"H2O_WAVE_COMPACT" cfgDefault:"" cfgHelper:"compact AOF log"`
	CertFile              string `cfg:"tls-cert-file" env:"H2O_WAVE_TLS_CERT_FILE" cfgDefault:"" cfgHelper:"path to certificate file (TLS only)"`
	KeyFile               string `cfg:"tls-key-file" env:"H2O_WAVE_TLS_KEY_FILE" cfgDefault:"" cfgHelper:"path to private key file (TLS only)"`
	SkipCertVerification  bool   `cfg:"no-tls-verify" env:"H2O_WAVE_NO_TLS_VERIFY" cfgDefault:"false" cfgHelper:"do not verify TLS certificates during external communication - DO NOT USE IN PRODUCTION"`
	HttpHeadersFile       string `cfg:"http-headers-file" env:"H2O_WAVE_HTTP_HEADERS_FILE" cfgDefault:"" cfgHelper:"path to a MIME-formatted file containing additional HTTP headers to add to responses from the server"`
	ForwardedHttpHeaders  string `cfg:"forwarded-http-headers" env:"H2O_WAVE_FORWARDED_HTTP_HEADERS" cfgDefault:"*" cfgHelper:"comma-separated list of case insesitive HTTP header keys to forward to the Wave app from the browser WS connection. If not specified, defaults to '*' - all headers are allowed. If set to an empty string, no headers are forwarded."`
	Editable              bool   `cfg:"editable" env:"H2O_WAVE_EDITABLE" cfgDefault:"false" cfgHelper:"allow users to edit web pages"`
	MaxRequestSize        string `cfg:"max-request-size" env:"H2O_WAVE_MAX_REQUEST_SIZE" cfgDefault:"5M" cfgHelper:"maximum allowed size of HTTP requests to the server (e.g. 5M or 5MB or 5MiB)"`
	MaxCacheRequestSize   string `cfg:"max-cache-request-size" env:"H2O_WAVE_MAX_CACHE_REQUEST_SIZE" cfgDefault:"5M" cfgHelper:"maximum allowed size of HTTP requests to the server cache (e.g. 5M or 5MB or 5MiB)"`
	Proxy                 bool   `cfg:"proxy" env:"H2O_WAVE_PROXY" cfgDefault:"false" cfgHelper:"enable HTTP proxy (for IDE / language server support only - not recommended for internet-facing websites)"`
	MaxProxyRequestSize   string `cfg:"max-proxy-request-size" env:"H2O_WAVE_MAX_PROXY_REQUEST_SIZE" cfgDefault:"5M" cfgHelper:"maximum allowed size of proxied HTTP requests (e.g. 5M or 5MB or 5MiB)"`
	MaxProxyResponseSize  string `cfg:"max-proxy-response-size" env:"H2O_WAVE_MAX_PROXY_RESPONSE_SIZE" cfgDefault:"5M" cfgHelper:"maximum allowed size of proxied HTTP responses (e.g. 5M or 5MB or 5MiB)"`
	SessionExpiry         string `cfg:"session-expiry" env:"H2O_WAVE_SESSION_EXPIRY" cfgDefault:"720h" cfgHelper:"session cookie lifetime duration (e.g. 1800s or 30m or 0.5h)"`
	InactivityTimeout     string `cfg:"session-inactivity-timeout" env:"H2O_WAVE_SESSION_INACTIVITY_TIMEOUT" cfgDefault:"30m" cfgHelper:"session inactivity timeout duration (e.g. 1800s or 30m or 0.5h)"`
	PingInterval          string `cfg:"ping-interval" env:"H2O_WAVE_PING_INTERVAL" cfgDefault:"50s" cfgHelper:"how often should ping messages be sent (e.g. 60s or 1m or 0.1h) to keep the websocket connection alive (default 50s)"`
	NoStore               bool   `cfg:"no-store" env:"H2O_WAVE_NO_STORE" cfgDefault:"false" cfgHelper:"disable storage (scripts and multicast/broadcast apps will not work)"`
	NoLog                 bool   `cfg:"no-log" env:"H2O_WAVE_NO_LOG" cfgDefault:"false" cfgHelper:"disable AOF logging (connect/disconnect and diagnostic logging messages are not disabled)"`
	Debug                 bool   `cfg:"debug" env:"H2O_WAVE_DEBUG" cfgDefault:"false" cfgHelper:"enable debug mode (profiling, inspection, etc.)"`
	ClientID              string `cfg:"oidc-client-id" env:"H2O_WAVE_OIDC_CLIENT_ID" cfgDefault:"" cfgHelper:"OIDC client ID"`
	ClientSecret          string `cfg:"oidc-client-secret" env:"H2O_WAVE_OIDC_CLIENT_SECRET" cfgDefault:"" cfgHelper:"OIDC client secret"`
	ProviderUrl           string `cfg:"oidc-provider-url" env:"H2O_WAVE_OIDC_PROVIDER_URL" cfgDefault:"" cfgHelper:"OIDC provider URL"`
	RedirectUrl           string `cfg:"oidc-redirect-url" env:"H2O_WAVE_OIDC_REDIRECT_URL" cfgDefault:"" cfgHelper:"OIDC redirect URL"`
	EndSessionUrl         string `cfg:"oidc-end-session-url" env:"H2O_WAVE_OIDC_END_SESSION_URL" cfgDefault:"" cfgHelper:"OIDC end session URL"`
	PostLogoutRedirectUrl string `cfg:"oidc-post-logout-redirect-url" env:"H2O_WAVE_OIDC_POST_LOGOUT_REDIRECT_URL" cfgDefault:"" cfgHelper:"OIDC post logout redirect URL"`
	RawAuthScopes         string `cfg:"oidc-scopes" env:"H2O_WAVE_OIDC_SCOPES" cfgDefault:"openid,profile" cfgHelper:"OIDC scopes, comma-separated (default \"openid,profile\")"`
	RawAuthURLParams      string `cfg:"oidc-auth-url-params" env:"H2O_WAVE_OIDC_AUTH_URL_PARAMS" cfgDefault:"" cfgHelper:"additional URL parameters to pass during OIDC authorization, in the format \"key:value\", comma-separated, e.g. \"foo:bar,qux:42\""`
	SkipLogin             bool   `cfg:"oidc-skip-login" env:"H2O_WAVE_OIDC_SKIP_LOGIN" cfgDefault:"false" cfgHelper:"do not display the login form during OIDC authorization"`
	KeepAppLive           bool   `cfg:"keep-app-live" env:"H2O_WAVE_KEEP_APP_LIVE" cfgDefault:"false" cfgHelper:"do not unregister unresponsive apps"`
	Conf                  string `cfg:"conf" env:"H2O_WAVE_CONF" cfgDefault:".env" cfgHelper:"path to configuration file"`
	ReconnectTimeout      string `cfg:"reconnect-timeout" env:"H2O_WAVE_RECONNECT_TIMEOUT" cfgDefault:"5s" cfgHelper:"Time to wait for reconnect before dropping the client"`
	AllowedOrigins        string `cfg:"allowed-origins" env:"H2O_WAVE_ALLOWED_ORIGINS" cfgDefault:"" cfgHelper:"comma-separated list of allowed origins (e.g. http://foo.com) for websocket upgrades"`
}
