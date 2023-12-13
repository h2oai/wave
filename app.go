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
	"fmt"
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
	broker    *Broker
	client    *http.Client
	mode      AppMode // mode
	route     string  // route
	addr      string  // upstream address http://host:port
	keyID     string  // access key ID
	keySecret string  // access key secret
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

func newApp(broker *Broker, mode, route, addr, keyID, keySecret string) *App {
	return &App{
		broker,
		&http.Client{}, // TODO tune keep-alive and idle timeout
		toAppMode(mode),
		route,
		addr,
		keyID,
		keySecret,
	}
}

func (app *App) disconnect(clientID string) error {
	req, err := http.NewRequest("POST", app.addr+"/disconnect", nil)
	if err != nil {
		return fmt.Errorf("failed creating request: %v", err)
	}

	req.SetBasicAuth(app.keyID, app.keySecret)
	req.Header.Set("Wave-Client-ID", clientID)

	resp, err := app.client.Do(req)
	if err != nil {
		return fmt.Errorf("request failed: %v", err)
	}
	defer resp.Body.Close()
	if resp.StatusCode != 200 {
		return fmt.Errorf("request failed: %s", http.StatusText(resp.StatusCode))
	}
	if _, err := readWithLimit(resp.Body, 0); err != nil { // apps always return empty plain-text responses.
		return fmt.Errorf("failed reading response: %v", err)
	}
	return nil
}

func (app *App) forward(clientID string, session *Session, data []byte) {
	if err := app.send(clientID, session, data); err != nil {
		echo(Log{"t": "app", "route": app.route, "host": app.addr, "error": err.Error()})
		if !app.broker.keepAppLive {
			app.broker.dropApp(app.route)
		}
	}
}

func (app *App) send(clientID string, session *Session, data []byte) error {
	req, err := http.NewRequest("POST", app.addr, bytes.NewReader(data))
	if err != nil {
		return fmt.Errorf("failed creating request: %v", err)
	}

	req.SetBasicAuth(app.keyID, app.keySecret)

	req.Header.Set("Content-Type", "application/json; charset=utf-8")
	if len(clientID) > 0 {
		req.Header.Set("Wave-Client-ID", clientID)
	}
	req.Header.Set("Wave-Subject-ID", session.subject)
	req.Header.Set("Wave-Username", session.username)
	if session.subject != anon {
		req.Header.Set("Wave-Session-ID", session.id)
		// TMP. Token should never be nil.
		if session.token != nil {
			req.Header.Set("Wave-Access-Token", session.token.AccessToken)
			req.Header.Set("Wave-Refresh-Token", session.token.RefreshToken)
		} else {
			// Should never happen.
			echo(Log{
				"t":          "app",
				"error":      "missing access token in send",
				"sessionID":  session.id,
				"subject":    session.subject,
				"username":   session.username,
				"access_url": session.successURL,
				"expiry":     session.expiry.String(),
			})
		}
	}

	resp, err := app.client.Do(req)
	if err != nil {
		return fmt.Errorf("request failed: %v", err)
	}
	defer resp.Body.Close()
	if resp.StatusCode != 200 {
		return fmt.Errorf("request failed: %s", http.StatusText(resp.StatusCode))
	}
	if _, err := readWithLimit(resp.Body, 0); err != nil { // apps always return empty plain-text responses.
		return fmt.Errorf("failed reading response: %v", err)
	}
	return nil
}
