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
	"errors"
	"fmt"
	"net/http"
	"net/url"
	"path"
	"sync"
	"time"

	"github.com/coreos/go-oidc"
	"github.com/google/uuid"
	"github.com/h2oai/wave/pkg/keychain"
	"golang.org/x/oauth2"
)

const authCookieName = "oidcsession"

var authDefaultScopes = []string{oidc.ScopeOpenID, "profile"}

func connectToProvider(conf *AuthConf) (*oauth2.Config, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	provider, err := oidc.NewProvider(ctx, conf.ProviderURL)
	if err != nil {
		return nil, err
	}
	scopes := authDefaultScopes
	if len(conf.Scopes) > 0 && conf.Scopes[0] != "" {
		scopes = conf.Scopes
	}
	return &oauth2.Config{
		ClientID:     conf.ClientID,
		ClientSecret: conf.ClientSecret,
		Endpoint:     provider.Endpoint(),
		RedirectURL:  conf.RedirectURL,
		Scopes:       scopes,
	}, nil
}

// Session represents an end-user session
type Session struct {
	sync.RWMutex
	id         string
	state      string
	nonce      string
	subject    string
	username   string
	successURL string
	token      *oauth2.Token
	expiry     time.Time
}

var errInactivityTimeout = errors.New("timed out due to inactivity")

func (s *Session) touch(timeout time.Duration) error {
	if s == anonymous {
		return nil
	}

	now := time.Now()

	s.RLock()
	expired := s.expiry.Before(now)
	s.RUnlock()

	if expired {
		return errInactivityTimeout
	}

	s.Lock()
	s.expiry = now.Add(timeout)
	s.Unlock()

	return nil
}

const (
	anon = "anon"
)

var anonymous = &Session{
	subject:  anon,
	username: anon,
	token:    &oauth2.Token{},
	expiry:   time.Now().Add(365 * 24 * time.Hour),
}

// Auth holds authenticated end-user sessions
type Auth struct {
	sync.RWMutex
	conf     *AuthConf
	oauth    *oauth2.Config
	sessions map[string]*Session
	baseURL  string
	initURL  string
	loginURL string
}

func newAuth(conf *AuthConf, baseURL, initURL, loginURL string) (*Auth, error) {
	oauth, err := connectToProvider(conf)
	if err != nil {
		return nil, err
	}
	return &Auth{
		conf:     conf,
		oauth:    oauth,
		sessions: make(map[string]*Session),
		baseURL:  baseURL,
		initURL:  initURL,
		loginURL: loginURL,
	}, nil
}

func (auth *Auth) get(key string) (*Session, bool) {
	auth.RLock()
	defer auth.RUnlock()
	session, ok := auth.sessions[key]
	return session, ok
}

func (auth *Auth) set(session *Session) {
	auth.Lock()
	defer auth.Unlock()
	if session == nil {
		// Should not happen.
		echo(Log{"t": "TMP_DBG", "error": "trying to set nil session"})
	}

	auth.sessions[session.id] = session
}

func (auth *Auth) remove(key string) {
	auth.Lock()
	defer auth.Unlock()
	delete(auth.sessions, key)
}

func (auth *Auth) identify(r *http.Request) *Session {
	cookie, err := r.Cookie(authCookieName)
	if err != nil {
		echo(Log{"t": "oauth2_cookie_read", "warning": err.Error()})
		return nil
	}

	sessionID := cookie.Value
	session, ok := auth.get(sessionID)
	if !ok {
		echo(Log{"t": "oauth2_session", "error": "invalid session", "session_id": sessionID})
		return nil
	}

	if err := session.touch(auth.conf.InactivityTimeout); err != nil {
		echo(Log{"t": "inactivity_timeout", "subject": session.subject})
		return nil
	}

	token, err := auth.ensureValidOAuth2Token(r.Context(), session.token)
	if err != nil {
		echo(Log{"t": "oauth2_token_refresh", "error": err.Error(), "subject": session.subject})
		return nil
	}

	if session.token != token {
		session.token = token
		auth.set(session)
	}

	if session.token == nil {
		// Should not happen.
		echo(Log{"t": "TMP_DBG", "error": "trying to set session with nil token in auth.identify"})
	}

	return session
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

		if r.URL.Path == auth.loginURL {
			if auth.conf.SkipLogin {
				auth.redirectToAuth(w, r)
				return
			}
			h.ServeHTTP(w, r)
			return
		}

		if !auth.allow(r) {
			auth.redirectToLogin(w, r)
			return
		}

		h.ServeHTTP(w, r)
	})
}

func (auth *Auth) ensureValidOAuth2Token(ctx context.Context, token *oauth2.Token) (*oauth2.Token, error) {
	token, err := auth.oauth.TokenSource(ctx, token).Token()
	if token == nil && err == nil {
		// Should not happen.
		echo(Log{"t": "TMP_DBG", "error": "trying to set session with nil token in ensureValidOAuth2Token"})
	}
	return token, err
}

func (auth *Auth) redirectToLogin(w http.ResponseWriter, r *http.Request) {
	// X -> /_auth/login?next=X
	u, _ := url.Parse(auth.loginURL)
	q := u.Query()
	q.Set("next", r.URL.Path)
	u.RawQuery = q.Encode()
	http.Redirect(w, r, u.String(), http.StatusFound)
}

func (auth *Auth) redirectToAuth(w http.ResponseWriter, r *http.Request) {
	// /_auth/login -> /_auth/init
	// /_auth/login?next=X -> /_auth/init?next=X
	u, _ := url.Parse(auth.initURL)
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

	successURL := h.auth.baseURL
	if nextValues, ok := r.URL.Query()["next"]; ok {
		successURL = nextValues[0]
	}

	// Session ID stored in cookie.
	sessionID := uuid.New().String()

	h.auth.set(&Session{id: sessionID, state: state, nonce: nonce, successURL: successURL, expiry: time.Now().Add(h.auth.conf.InactivityTimeout)})
	cookie := http.Cookie{Name: authCookieName, Value: sessionID, Path: h.auth.baseURL, Expires: time.Now().Add(h.auth.conf.SessionExpiry)}
	http.SetCookie(w, &cookie)

	var options []oauth2.AuthCodeOption
	options = append(options, oidc.Nonce(nonce))
	for _, param := range h.auth.conf.URLParameters {
		options = append(options, oauth2.SetAuthURLParam(param[0], param[1]))
	}
	http.Redirect(w, r, h.auth.oauth.AuthCodeURL(state, options...), http.StatusFound)
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
		echo(Log{"t": "oauth2_exchange", "error": err.Error()})
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

	h.auth.set(session)

	if session.token == nil {
		// Should not happen.
		echo(Log{"t": "TMP_DBG", "error": "trying to set session with nil token in authHandler"})
	}

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

func (h *LogoutHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	var idToken string

	// Retrieve saved session.
	cookie, err := r.Cookie(authCookieName)
	if err != nil {
		echo(Log{"t": "logout_cookie", "error": "not found"})
		h.redirect(w, r, idToken)
		return
	}

	sessionID := cookie.Value
	session, ok := h.auth.get(sessionID)

	// Delete cookie.
	cookie.MaxAge = -1
	http.SetCookie(w, cookie)

	// Purge session
	h.auth.remove(sessionID)

	if !ok {
		echo(Log{"t": "TMP_DBG", "error": "session not found during logout", "session_id": sessionID})
	}

	if ok {
		// Reload all of this user's browser tabs
		h.broker.resetClients(session)

		// A token may not be present if the oauth2 workflow failed, so check before access.
		if session.token != nil {
			idToken, _ = session.token.Extra("id_token").(string) // raw id_token (required by Okta)
		}
	}

	h.redirect(w, r, idToken)
}

func (h *LogoutHandler) redirect(w http.ResponseWriter, r *http.Request, idToken string) {
	if h.auth.conf.EndSessionURL == "" {
		http.Redirect(w, r, h.auth.baseURL, http.StatusFound)
		return
	}

	redirectURL, err := url.Parse(h.auth.conf.EndSessionURL)
	if err != nil {
		echo(Log{"t": "logout_redirect_parse", "error": err.Error()})
		return
	}

	post_logout_redirect_url := h.auth.conf.PostLogoutRedirectURL
	if post_logout_redirect_url == "" {
		post_logout_redirect_url = r.Host
	}
	query := redirectURL.Query()
	query.Set("post_logout_redirect_uri", post_logout_redirect_url)
	if len(idToken) > 0 {
		// required by Okta
		// https://developer.okta.com/docs/reference/api/oidc/#logout
		query.Set("id_token_hint", idToken)
	}
	redirectURL.RawQuery = query.Encode()

	http.Redirect(w, r, redirectURL.String(), http.StatusFound)
}

// Handles token refreshes.
type RefreshHandler struct {
	auth     *Auth
	keychain *keychain.Keychain
}

func newRefreshHandler(auth *Auth, keychain *keychain.Keychain) http.Handler {
	return &RefreshHandler{auth, keychain}
}

func (h *RefreshHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	if !h.keychain.Guard(w, r) { // API
		return
	}

	sessionID := r.Header.Get("Wave-Session-ID")
	session, ok := h.auth.get(sessionID)

	if !ok {
		echo(Log{"t": "refresh_session", "error": "session unavailable"})
		http.Error(w, http.StatusText(http.StatusUnauthorized), http.StatusUnauthorized)
		return
	}

	token, err := h.auth.ensureValidOAuth2Token(r.Context(), session.token)
	if err != nil {
		// Purge session and reload clients if refresh not successful?
		echo(Log{"t": "refresh_session", "error": err.Error()})
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}

	if token == nil {
		// Should not happen.
		echo(Log{"t": "TMP_DBG", "error": "trying to set session with nil token in refreshHandler"})
	}

	session.token = token
	h.auth.set(session)

	w.Header().Set("Wave-Access-Token", token.AccessToken)
	w.Header().Set("Wave-Refresh-Token", token.RefreshToken)
	w.WriteHeader(http.StatusOK)
}
