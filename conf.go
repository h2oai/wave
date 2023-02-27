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
	"os"
	"strings"
	"time"

	"github.com/h2oai/wave/pkg/keychain"
)

type Strings []string

func (s *Strings) Set(v string) error {
	*s = append(*s, v)
	return nil
}

func (s *Strings) String() string {
	return strings.Join(*s, string(os.PathListSeparator))
}

// ServerConf represents Server configuration options.
type ServerConf struct {
	Version              string
	BuildDate            string
	Listen               string
	BaseURL              string
	WebDir               string
	DataDir              string
	PublicDirs           Strings
	PrivateDirs          Strings
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
