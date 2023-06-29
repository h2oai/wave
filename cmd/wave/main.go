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
	"bufio"
	"bytes"
	"fmt"
	"log"
	"math"
	"net/http"
	"net/textproto"
	"os"
	"path/filepath"
	"runtime"
	"sort"
	"strings"
	"time"

	"github.com/h2oai/goconfig"
	_ "github.com/h2oai/goconfig/env"
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
	conf := wave.Conf{}
	serverConf := wave.ServerConf{}
	authConf := wave.AuthConf{}

	goconfig.File = ".env"
	if v, ok := os.LookupEnv("H2O_WAVE_CONF"); ok {
		goconfig.File = v
	}

	// Cannot register -conf flag with goconfig because it needs to be parsed prior to goconfig.Parse.
	args := os.Args[1:]
	for i, arg := range args {
		if arg == "-conf" {
			if i+1 < len(args) {
				goconfig.File = args[i+1]
			}
			break
		}
	}

	goconfig.PrefixEnv = "H2O_WAVE"
	goconfig.KebabCfgToSnakeEnv = true

	err := goconfig.Parse(&conf)
	if err != nil {
		panic(err.Error())
	}

	if len(conf.ForwardedHttpHeaders) > 0 {
		// More idiomatic way to store just keys and retrieve them in O(1)?
		serverConf.ForwardedHeaders = make(map[string]bool)
		for _, header := range strings.Split(conf.ForwardedHttpHeaders, ",") {
			serverConf.ForwardedHeaders[strings.ToLower(strings.TrimSpace(header))] = true
		}
	}

	if conf.Version {
		fmt.Printf("Wave Daemon\nVersion %s Build %s (%s/%s)\nCopyright (c) H2O.ai, Inc.\n", Version, BuildDate, runtime.GOOS, runtime.GOARCH)
		return
	}

	if len(conf.Compact) > 0 {
		wave.CompactSite(conf.Compact)
		return
	}

	kc, err := keychain.LoadKeychain(conf.AccessKeyFile)
	if err != nil {
		panic(fmt.Errorf("failed loading keychain: %v", err))
	}

	if conf.ListAccessKeys {
		keys := kc.IDs()
		sort.Strings(keys)
		for _, key := range keys {
			fmt.Println(key)
		}
		return
	}

	if len(conf.RemoveAccessKeyID) > 0 {
		if ok := kc.Remove(conf.RemoveAccessKeyID); !ok {
			fmt.Printf("error: access key ID %s not found in keychain %s\n", conf.RemoveAccessKeyID, kc.Name)
			os.Exit(1)
		}

		if err := kc.Save(); err != nil {
			panic(fmt.Errorf("failed writing keychain: %v", err))
		}
		fmt.Printf("Success! Key %s removed from keychain %s\n", conf.AccessKeyID, kc.Name)
		return
	}

	if conf.CreateAccessKey {
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
		if len(conf.AccessKeyID) == 0 || len(conf.AccessKeySecret) == 0 {
			panic("default access key ID or secret cannot be empty")
		}
		hash, err := keychain.HashSecret(conf.AccessKeySecret)
		if err != nil {
			panic(err)
		}
		kc.Add(conf.AccessKeyID, hash)
	}

	if len(conf.HttpHeadersFile) > 0 {
		headers, err := parseHTTPHeaders(conf.HttpHeadersFile)
		if err != nil {
			panic(err)
		}
		serverConf.Header = headers
	}

	if serverConf.MaxRequestSize, err = parseReadSize("max request size", conf.MaxRequestSize); err != nil {
		panic(err)
	}

	if serverConf.MaxCacheRequestSize, err = parseReadSize("max cache request size", conf.MaxCacheRequestSize); err != nil {
		panic(err)
	}

	if serverConf.MaxProxyRequestSize, err = parseReadSize("max proxy request size", conf.MaxProxyRequestSize); err != nil {
		panic(err)
	}

	if serverConf.MaxProxyResponseSize, err = parseReadSize("max proxy response size", conf.MaxProxyResponseSize); err != nil {
		panic(err)
	}

	if authConf.SessionExpiry, err = time.ParseDuration(conf.SessionExpiry); err != nil {
		panic(err)
	}

	if authConf.InactivityTimeout, err = time.ParseDuration(conf.InactivityTimeout); err != nil {
		panic(err)
	}

	serverConf.WebDir, _ = filepath.Abs(conf.WebDir)
	serverConf.DataDir, _ = filepath.Abs(conf.DataDir)
	serverConf.Version = Version
	serverConf.BuildDate = BuildDate
	serverConf.Listen = conf.Listen
	serverConf.BaseURL = conf.BaseUrl
	serverConf.PublicDirs = splitDirs(conf.PublicDirs)
	serverConf.PrivateDirs = splitDirs(conf.PrivateDirs)
	serverConf.Init = conf.Init
	serverConf.CertFile = conf.CertFile
	serverConf.KeyFile = conf.KeyFile
	serverConf.SkipCertVerification = conf.SkipCertVerification
	serverConf.Debug = conf.Debug
	serverConf.Editable = conf.Editable
	serverConf.Proxy = conf.Proxy
	serverConf.NoStore = conf.NoStore
	serverConf.NoLog = conf.NoLog
	serverConf.Keychain = kc
	serverConf.NoAppDropIfUnresponsive = conf.NoAppDropIfUnresponsive

	authConf.Scopes = strings.Split(conf.RawAuthScopes, ",")
	if len(conf.RawAuthURLParams) > 0 {
		rawAuthURLPairs := strings.Split(conf.RawAuthURLParams, ",")
		for _, rawPair := range rawAuthURLPairs {
			kv := strings.Split(rawPair, ":")
			if len(kv) != 2 {
				panic(fmt.Errorf("bad OIDC authorization url parameter: %v", rawPair))
			}
			k, v := kv[0], kv[1]
			if len(k) == 0 {
				panic(fmt.Errorf("empty OIDC authorization url parameter key: %v", rawPair))
			}
			if len(v) == 0 {
				panic(fmt.Errorf("empty OIDC authorization url parameter value: %v", rawPair))
			}
			authConf.URLParameters = append(authConf.URLParameters, kv)
		}
	}
	if authConf.SessionExpiry, err = time.ParseDuration(conf.SessionExpiry); err != nil {
		panic(err)
	}
	if authConf.InactivityTimeout, err = time.ParseDuration(conf.InactivityTimeout); err != nil {
		panic(err)
	}

	requiredEnvOIDC := map[string]string{
		"oidc-client-id":     conf.ClientID,
		"oidc-client-secret": conf.ClientSecret,
		"oidc-provider-url":  conf.ProviderUrl,
		"oidc-redirect-url":  conf.RedirectUrl,
	}
	emptyRequiredOIDCParams := getEmptyOIDCValues(requiredEnvOIDC)
	emptyRequiredOIDCParamsCount := len(emptyRequiredOIDCParams)
	if emptyRequiredOIDCParamsCount == 0 {
		authConf.ClientID = conf.ClientID
		authConf.ClientSecret = conf.ClientSecret
		authConf.ProviderURL = conf.ProviderUrl
		authConf.RedirectURL = conf.RedirectUrl
		authConf.EndSessionURL = conf.EndSessionUrl
		authConf.PostLogoutRedirectURL = conf.PostLogoutRedirectUrl
		authConf.SkipLogin = conf.SkipLogin
		serverConf.Auth = &authConf
	}
	if emptyRequiredOIDCParamsCount > 0 && emptyRequiredOIDCParamsCount != len(requiredEnvOIDC) {
		log.Println("#", "warning: the following OIDC required params were not set: ", emptyRequiredOIDCParams)
	}

	wave.Run(serverConf)
}

func getEmptyOIDCValues(requiredEnvOIDC map[string]string) []string {
	var emptyRequiredOIDCParams []string
	for param, val := range requiredEnvOIDC {
		if val == "" {
			emptyRequiredOIDCParams = append(emptyRequiredOIDCParams, param)
		}
	}
	return emptyRequiredOIDCParams
}

func splitDirs(dirs string) []string {
	if len(dirs) == 0 {
		return nil
	}
	return strings.Split(dirs, string(os.PathListSeparator))
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

func parseHTTPHeaders(file string) (http.Header, error) {
	b, err := os.ReadFile(file)
	if err != nil {
		return nil, fmt.Errorf("failed reading HTTP headers file: %v", err)
	}

	reader := textproto.NewReader(bufio.NewReader(bytes.NewReader(b)))
	header, err := reader.ReadMIMEHeader()
	if err != nil {
		return nil, fmt.Errorf("failed parsing HTTP headers from file: %v", err)
	}
	return http.Header(header), nil
}
