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
	"crypto/rand"
	"fmt"
	"net/http"
	"net/url"
	"sync"
	"time"

	"github.com/coreos/go-oidc"
	"github.com/google/uuid"
	"golang.org/x/oauth2"
)

const oidcSessionKey = "oidcsession"

// Auth represents active OIDC sessions
type Auth struct {
	sync.RWMutex
	sessions map[string]Session
}

func newAuth() *Auth {
	return &Auth{sessions: make(map[string]Session)}
}

func (s *Auth) get(key string) (Session, bool) {
	s.RLock()
	defer s.RUnlock()
	session, ok := s.sessions[key]
	return session, ok
}

func (s *Auth) set(key string, session Session) {
	s.Lock()
	defer s.Unlock()
	s.sessions[key] = session
}

func (s *Auth) remove(key string) {
	s.Lock()
	defer s.Unlock()
	delete(s.sessions, key)
}

// Session represents an OIDC session
type Session struct {
	state      string
	nonce      string
	subject    string
	username   string
	successURL string
	token      *oauth2.Token
}

func generateRandomKey(byteCount int) (string, error) {
	b := make([]byte, byteCount)
	_, err := rand.Read(b)
	if err != nil {
		return "", err
	}
	return fmt.Sprintf("%x", b), nil
}

// OIDCInitHandler handles auth requests
type OIDCInitHandler struct {
	sessions     *Auth
	oauth2Config *oauth2.Config
}

func newOIDCInitHandler(sessions *Auth, oauth2Config *oauth2.Config) http.Handler {
	return &OIDCInitHandler{
		sessions:     sessions,
		oauth2Config: oauth2Config,
	}
}

func (h *OIDCInitHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
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

	h.sessions.set(sessionID, Session{state: state, nonce: nonce, successURL: successURL})
	expiration := time.Now().Add(365 * 24 * time.Hour)
	cookie := http.Cookie{Name: oidcSessionKey, Value: sessionID, Path: "/", Expires: expiration}
	http.SetCookie(w, &cookie)
	http.Redirect(w, r, h.oauth2Config.AuthCodeURL(state, oidc.Nonce(nonce)), http.StatusFound)
}

// OAuth2Handler handles OAuth2 requests
type OAuth2Handler struct {
	sessions     *Auth
	oauth2Config *oauth2.Config
	providerURL  string
}

func newOAuth2Handler(sessions *Auth, oauth2Config *oauth2.Config, providerURL string) http.Handler {
	return &OAuth2Handler{
		sessions:     sessions,
		oauth2Config: oauth2Config,
		providerURL:  providerURL,
	}
}

func (h *OAuth2Handler) ServeHTTP(w http.ResponseWriter, r *http.Request) {

	// Retrieve saved session.
	cookie, err := r.Cookie(oidcSessionKey)
	if err != nil {
		echo(Log{"t": "oauth2_cookie", "error": err.Error()})
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}
	sessionID := cookie.Value
	session, ok := h.sessions.get(sessionID)
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

	oAuth2Provider, err := oidc.NewProvider(r.Context(), h.providerURL)
	if err != nil {
		echo(Log{"t": "oauth2_oidc_provider", "error": err.Error()})
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}

	oauth2Token, err := h.oauth2Config.Exchange(r.Context(), r.URL.Query().Get("code"))
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

	oidcVerifier := oAuth2Provider.Verifier(&oidc.Config{ClientID: h.oauth2Config.ClientID})
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

	h.sessions.set(sessionID, session)

	http.Redirect(w, r, session.successURL, http.StatusFound)
}

// OIDCLogoutHandler handles logout requests
type OIDCLogoutHandler struct {
	sessions      *Auth
	endSessionURL string
}

func newOIDCLogoutHandler(sessions *Auth, endSessionURL string) http.Handler {
	return &OIDCLogoutHandler{sessions, endSessionURL}
}

func (h *OIDCLogoutHandler) logoutRedirect(w http.ResponseWriter, r *http.Request) {
	if h.endSessionURL == "" {
		http.Redirect(w, r, "/", http.StatusFound)
	} else {
		redirectURL, err := url.Parse(h.endSessionURL)
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
}

func (h *OIDCLogoutHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {

	// Retrieve saved session.
	cookie, err := r.Cookie(oidcSessionKey)
	if err != nil {
		echo(Log{"t": "logout_cookie", "error": "not found"})
		h.logoutRedirect(w, r)
		return
	}
	sessionID := cookie.Value

	// Delete cookie.
	cookie.MaxAge = -1
	http.SetCookie(w, cookie)

	// Clean up session.
	_, ok := h.sessions.get(sessionID)
	if !ok {
		echo(Log{"t": "logout_session", "error": "not found"})
		h.logoutRedirect(w, r)
		return
	}
	h.sessions.remove(sessionID)

	h.logoutRedirect(w, r)
}
