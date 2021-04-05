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
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
	"time"
)

// Proxy represents a HTTP proxy
type Proxy struct {
	client          *http.Client
	auth            *Auth
	maxRequestSize  int64
	maxResponseSize int64
}

// ProxyRequest represents the request to be sent to the upstream server.
type ProxyRequest struct {
	Method  string              `json:"method"`
	URL     string              `json:"url"`
	Headers map[string][]string `json:"headers"`
	Body    string              `json:"body"`
}

// ProxyResponse represents the response received from the upstream server.
type ProxyResponse struct {
	Status  string              `json:"status"`
	Code    int                 `json:"code"`
	Headers map[string][]string `json:"headers"`
	Body    string              `json:"body"`
}

// ProxyResult represents the result returned for a proxy request.
type ProxyResult struct {
	Error  string         `json:"error"`
	Result *ProxyResponse `json:"result"`
}

func newProxy(auth *Auth, maxRequestSize, maxResponseSize int64) *Proxy {
	return &Proxy{
		&http.Client{
			Timeout: time.Second * 10,
		},
		auth,
		maxRequestSize,
		maxResponseSize,
	}
}

func (p *Proxy) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodPost:
		// Disallow if:
		// - unauthorized api call
		// - auth not enabled or auth enabled and unauthorized
		if p.auth == nil || (p.auth != nil && !p.auth.allow(r)) {
			http.Error(w, http.StatusText(http.StatusUnauthorized), http.StatusUnauthorized)
			return
		}

		req, err := readRequestWithLimit(w, r.Body, p.maxRequestSize)
		if err != nil {
			echo(Log{"t": "read proxy request body", "error": err.Error()})
			http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
			return
		}
		res, err := p.forward(req)
		if err != nil {
			http.Error(w, fmt.Sprintf("%s: %v", http.StatusText(http.StatusBadRequest), err), http.StatusBadRequest)
			return
		}
		w.Header().Set("Content-Type", contentTypeJSON)
		w.Write(res)
	default:
		http.Error(w, http.StatusText(http.StatusMethodNotAllowed), http.StatusMethodNotAllowed)
	}
}

func (p *Proxy) forward(input []byte) ([]byte, error) {
	var pr ProxyRequest
	if err := json.Unmarshal(input, &pr); err != nil {
		return nil, fmt.Errorf("failed unmarshaling proxy request: %v", err)
	}

	var result ProxyResult
	if res, err := p.do(pr); err != nil {
		result.Error = err.Error()
	} else {
		result.Result = &res
	}

	output, err := json.Marshal(&result)
	if err != nil {
		return nil, fmt.Errorf("failed marshaling proxy response: %v", err)
	}
	return output, nil
}

func (p *Proxy) do(pr ProxyRequest) (ProxyResponse, error) {
	var none ProxyResponse

	req, err := http.NewRequest(pr.Method, pr.URL, strings.NewReader(pr.Body))
	if err != nil {
		return none, err
	}
	for name, values := range pr.Headers {
		for _, value := range values {
			req.Header.Add(name, value)
		}
	}

	resp, err := p.client.Do(req)
	if err != nil {
		return none, err
	}
	defer resp.Body.Close()

	body, err := readWithLimit(resp.Body, p.maxResponseSize)
	if err != nil {
		return none, err
	}

	return ProxyResponse{
		resp.Status,
		resp.StatusCode,
		resp.Header,
		string(body),
	}, nil
}
