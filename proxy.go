package wave

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"strings"
	"time"
)

// Proxy represents a HTTP proxy
type Proxy struct {
	client *http.Client
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

func newProxy() *Proxy {
	return &Proxy{
		&http.Client{
			Timeout: time.Second * 10,
		},
	}
}

func (p *Proxy) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodPost:
		req, err := ioutil.ReadAll(r.Body) // XXX limit
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

	body, err := ioutil.ReadAll(resp.Body) // XXX limit
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
