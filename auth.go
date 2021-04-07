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
	"context"
	"crypto/rand"
	"fmt"
	"net/http"
	"net/url"
	"path"
	"sync"
	"time"

	"github.com/coreos/go-oidc"
	"github.com/google/uuid"
	"golang.org/x/oauth2"
)

const authCookieName = "oidcsession"

func connectToProvider(conf *AuthConf) (*oauth2.Config, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	provider, err := oidc.NewProvider(ctx, conf.ProviderURL)
	if err != nil {
		return nil, err
	}
	return &oauth2.Config{
		ClientID:     conf.ClientID,
		ClientSecret: conf.ClientSecret,
		Endpoint:     provider.Endpoint(),
		RedirectURL:  conf.RedirectURL,
		//TODO: make configurable
		//TODO review: does this return preferred_username if Profile is not included in scope?
		Scopes: []string{oidc.ScopeOpenID},
	}, nil
}

// Session represents an end-user session
type Session struct {
	state      string
	nonce      string
	subject    string
	username   string
	successURL string
	token      *oauth2.Token
}

var anonymous = &Session{
	subject:  "anonymous",
	username: "anonymous",
	token:    &oauth2.Token{},
}

// Auth holds authenticated end-user sessions
type Auth struct {
	sync.RWMutex
	conf     *AuthConf
	oauth    *oauth2.Config
	sessions map[string]Session
}

func newAuth(conf *AuthConf) (*Auth, error) {
	oauth, err := connectToProvider(conf)
	if err != nil {
		return nil, err
	}
	return &Auth{
		conf:     conf,
		oauth:    oauth,
		sessions: make(map[string]Session),
	}, nil
}

func (auth *Auth) get(key string) (Session, bool) {
	auth.RLock()
	defer auth.RUnlock()
	session, ok := auth.sessions[key]
	return session, ok
}

func (auth *Auth) set(key string, session Session) {
	auth.Lock()
	defer auth.Unlock()
	auth.sessions[key] = session
}

func (auth *Auth) remove(key string) {
	auth.Lock()
	defer auth.Unlock()
	delete(auth.sessions, key)
}

func (auth *Auth) identify(r *http.Request) *Session {
	cookie, err := r.Cookie(authCookieName)
	if err != nil {
		echo(Log{"t": "oauth2_cookie_read", "error": err.Error()})
		return nil
	}

	sessionID := cookie.Value
	session, ok := auth.get(sessionID)
	if !ok {
		echo(Log{"t": "oauth2_session", "error": "invalid session"})
		return nil
	}

	token, err := auth.oauth.TokenSource(r.Context(), session.token).Token()
	if err != nil {
		echo(Log{"t": "oauth2_token_refresh", "error": err.Error()})
		return nil
	}

	if session.token != token {
		session.token = token
		auth.set(sessionID, session)
	}

	return &session
}

func (auth *Auth) allow(r *http.Request) bool {
	return auth.identify(r) != nil
}

func (auth *Auth) wrap(h http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if len(path.Ext(r.URL.Path)) > 0 {
			h.ServeHTTP(w, r)
			return
		}

		if r.URL.Path == "/_auth/login" {
			if auth.conf.SkipLogin {
				redirectToAuth(w, r)
				return
			}
			h.ServeHTTP(w, r)
			return
		}

		if !auth.allow(r) {
			redirectToLogin(w, r)
			return
		}

		h.ServeHTTP(w, r)
	})
}

func redirectToLogin(w http.ResponseWriter, r *http.Request) {
	// X -> /_auth/login?next=X
	u, _ := url.Parse("/_auth/login")
	q := u.Query()
	q.Set("next", r.URL.Path)
	u.RawQuery = q.Encode()
	http.Redirect(w, r, u.String(), http.StatusFound)
}

func redirectToAuth(w http.ResponseWriter, r *http.Request) {
	// /_auth/login -> /_auth/init
	// /_auth/login?next=X -> /_auth/init?next=X
	u, _ := url.Parse("/_auth/init")
	next := r.URL.Query().Get("next")
	if next != "" {
		q := u.Query()
		q.Set("next", next)
		u.RawQuery = q.Encode()
	}
	http.Redirect(w, r, u.String(), http.StatusFound)
}

func generateRandomKey(byteCount int) (string, error) {
	b := make([]byte, byteCount)
	_, err := rand.Read(b)
	if err != nil {
		return "", err
	}
	return fmt.Sprintf("%x", b), nil
}

// LoginHandler handles auth requests
type LoginHandler struct {
	auth *Auth
}

func newLoginHandler(auth *Auth) http.Handler {
	return &LoginHandler{auth}
}

func (h *LoginHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	// `state` is to protect from CSRF (OAuth2 part).
	state, err := generateRandomKey(4)
	if err != nil {
		echo(Log{"t": "oidc_random_state_key", "error": err.Error()})
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}

	// `nonce` is to protect from replay attacks (OpenID part).
	nonce, err := generateRandomKey(4)
	if err != nil {
		echo(Log{"t": "oidc_random_nonce_key", "error": err.Error()})
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}

	successURL := "/"
	if nextValues, ok := r.URL.Query()["next"]; ok {
		successURL = nextValues[0]
	}

	// Session ID stored in cookie.
	sessionID := uuid.New().String()

	h.auth.set(sessionID, Session{state: state, nonce: nonce, successURL: successURL})
	expiration := time.Now().Add(365 * 24 * time.Hour)
	cookie := http.Cookie{Name: authCookieName, Value: sessionID, Path: "/", Expires: expiration}
	http.SetCookie(w, &cookie)
	http.Redirect(w, r, h.auth.oauth.AuthCodeURL(state, oidc.Nonce(nonce)), http.StatusFound)
}

// AuthHandler handles OAuth2 requests
type AuthHandler struct {
	auth *Auth
}

func newAuthHandler(auth *Auth) http.Handler {
	return &AuthHandler{auth}
}

func (h *AuthHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	// Retrieve saved session.
	cookie, err := r.Cookie(authCookieName)
	if err != nil {
		echo(Log{"t": "oauth2_cookie", "error": err.Error()})
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}

	sessionID := cookie.Value
	session, ok := h.auth.get(sessionID)
	if !ok {
		echo(Log{"t": "oauth2_session", "error": "not found"})
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}

	// Handle errors from provider.
	if err := r.URL.Query().Get("error"); err != "" {
		errorDescription := r.URL.Query().Get("error_description")
		echo(Log{"t": "oauth2_callback", "error": err, "description": errorDescription})
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}

	// Compare to stored state.
	responseState := r.URL.Query().Get("state")
	if session.state != responseState {
		echo(Log{"t": "oauth2_state", "error": "failed matching state"})
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}

	oAuth2Provider, err := oidc.NewProvider(r.Context(), h.auth.conf.ProviderURL)
	if err != nil {
		echo(Log{"t": "oauth2_oidc_provider", "error": err.Error()})
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}

	oauth2Token, err := h.auth.oauth.Exchange(r.Context(), r.URL.Query().Get("code"))
	if err != nil {
		echo(Log{"t": "oauth2_exchange", "error": "failed exchanging code with provider"})
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}

	rawIDToken, ok := oauth2Token.Extra("id_token").(string)
	if !ok {
		echo(Log{"t": "oauth2_exchange", "error": "failed reading id_token"})
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}

	oidcVerifier := oAuth2Provider.Verifier(&oidc.Config{ClientID: h.auth.oauth.ClientID})
	idToken, err := oidcVerifier.Verify(r.Context(), rawIDToken)
	if err != nil {
		echo(Log{"t": "oauth2_oidc_verifier", "error": "failed verifying id_token"})
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}

	var claims struct {
		PreferredUsername string `json:"preferred_username"`
		Nonce             string `json:"nonce"`
	}
	err = idToken.Claims(&claims)
	if err != nil {
		echo(Log{"t": "oauth2_claim", "error": "failed parsing token claims"})
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}

	// Compare to stored nonce.
	if session.nonce != claims.Nonce {
		if !ok {
			echo(Log{"t": "oauth2_nonce", "error": "failed matching nonce"})
			http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
			return
		}
	}

	session.token = oauth2Token
	session.subject = idToken.Subject
	session.username = claims.PreferredUsername

	echo(Log{"t": "login", "subject": session.subject, "username": session.username})

	h.auth.set(sessionID, session)

	http.Redirect(w, r, session.successURL, http.StatusFound)
}

// LogoutHandler handles logout requests
type LogoutHandler struct {
	auth   *Auth
	broker *Broker
}

func newLogoutHandler(auth *Auth, broker *Broker) http.Handler {
	return &LogoutHandler{auth, broker}
}

func (h *LogoutHandler) logoutRedirect(w http.ResponseWriter, r *http.Request) {
	if h.auth.conf.EndSessionURL == "" {
		http.Redirect(w, r, "/", http.StatusFound)
		return
	}

	redirectURL, err := url.Parse(h.auth.conf.EndSessionURL)
	if err != nil {
		echo(Log{"t": "logout_redirect_parse", "error": err.Error()})
		return
	}

	query := redirectURL.Query()
	// TODO (#291): some providers, for example OKTA, require id_token_hint
	query.Set("post_logout_redirect_uri", r.Host)
	redirectURL.RawQuery = query.Encode()

	http.Redirect(w, r, redirectURL.String(), http.StatusFound)
}

func (h *LogoutHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	// Retrieve saved session.
	cookie, err := r.Cookie(authCookieName)
	if err != nil {
		echo(Log{"t": "logout_cookie", "error": "not found"})
		h.logoutRedirect(w, r)
		return
	}

	sessionID := cookie.Value
	session, ok := h.auth.get(sessionID)

	// Delete cookie.
	cookie.MaxAge = -1
	http.SetCookie(w, cookie)

	// Purge session
	h.auth.remove(sessionID)

	// Reload all of this user's browser tabs
	if ok {
		h.broker.resetClients(session.subject)
	}

	h.logoutRedirect(w, r)
}
