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
	"bytes"
	"net/http"
)

// AppMode represents app modes.
type AppMode int

const (
	unicastMode AppMode = iota
	multicastMode
	broadcastMode
)

// App represents an app
type App struct {
	broker *Broker
	client *http.Client
	mode   AppMode // mode
	route  string  // route
	addr   string  // upstream address http://host:port
}

// Boot represents the initial message sent when a client connects to an app
type Boot struct {
	Hash string `json:"#,omitempty"` // location hash
}

func toAppMode(mode string) AppMode {
	switch mode {
	case "broadcast":
		return broadcastMode
	case "multicast":
		return multicastMode
	}
	return unicastMode
}

func newApp(broker *Broker, mode, route, addr string) *App {
	return &App{
		broker,
		&http.Client{}, // TODO tune keep-alive and idle timeout
		toAppMode(mode),
		route,
		addr,
	}
}

func (app *App) forward(data []byte) {
	if !app.send(data) {
		app.broker.dropApp(app.route)
	}
}

func (app *App) send(data []byte) bool {
	resp, err := app.client.Post(app.addr, "text/plain; charset=utf-8", bytes.NewReader(data))
	if err != nil {
		echo(Log{"t": "app", "route": app.route, "host": app.addr, "error": err.Error()})
		return false
	}
	defer resp.Body.Close()
	if _, err := readWithLimit(resp.Body, 0); err != nil { // apps always return empty plain-text responses.
		echo(Log{"t": "app", "route": app.route, "host": app.addr, "error": err.Error()})
		return false
	}
	return true
}
