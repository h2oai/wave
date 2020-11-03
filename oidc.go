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

// OIDCSessions represents active OIDC sessions
type OIDCSessions struct {
	sync.RWMutex
	sessions map[string]OIDCSession
}

func newOIDCSessions() *OIDCSessions {
	return &OIDCSessions{sessions: make(map[string]OIDCSession)}
}

func (s *OIDCSessions) get(key string) (OIDCSession, bool) {
	s.RLock()
	defer s.RUnlock()
	session, ok := s.sessions[key]
	return session, ok
}

func (s *OIDCSessions) set(key string, session OIDCSession) {
	s.Lock()
	defer s.Unlock()
	s.sessions[key] = session
}

func (s *OIDCSessions) remove(key string) {
	s.Lock()
	defer s.Unlock()
	delete(s.sessions, key)
}

// OIDCSession represents an OIDC session
type OIDCSession struct {
	state        string
	nonce        string
	accessToken  string
	refreshToken string
	subject      string
	username     string
	successURL   string
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
	sessions     *OIDCSessions
	clientID     string
	clientSecret string
	providerURL  string
	redirectURL  string
}

func newOIDCInitHandler(sessions *OIDCSessions, clientID, clientSecret, providerURL, redirectURL string) http.Handler {
	return &OIDCInitHandler{
		sessions,
		clientID,
		clientSecret,
		providerURL,
		redirectURL,
	}
}

func (h *OIDCInitHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	oAuth2Provider, err := oidc.NewProvider(r.Context(), h.providerURL)
	if err != nil {
		echo(Log{"t": "oidc_provider", "error": err.Error()})
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}

	oAuth2Config := oauth2.Config{
		ClientID:     h.clientID,
		ClientSecret: h.clientSecret,
		RedirectURL:  h.redirectURL,
		Endpoint:     oAuth2Provider.Endpoint(),
		Scopes:       []string{oidc.ScopeOpenID},
	}

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

	h.sessions.set(sessionID, OIDCSession{state: state, nonce: nonce, successURL: successURL})
	expiration := time.Now().Add(365 * 24 * time.Hour)
	cookie := http.Cookie{Name: oidcSessionKey, Value: sessionID, Path: "/", Expires: expiration}
	http.SetCookie(w, &cookie)
	http.Redirect(w, r, oAuth2Config.AuthCodeURL(state, oidc.Nonce(nonce)), http.StatusFound)
}

// OAuth2Handler handles OAuth2 requests
type OAuth2Handler struct {
	sessions     *OIDCSessions
	clientID     string
	clientSecret string
	providerURL  string
	redirectURL  string
}

func newOAuth2Handler(sessions *OIDCSessions, clientID, clientSecret, providerURL, redirectURL string) http.Handler {
	return &OAuth2Handler{
		sessions,
		clientID,
		clientSecret,
		providerURL,
		redirectURL,
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

	oAuth2Config := oauth2.Config{
		ClientID:     h.clientID,
		ClientSecret: h.clientSecret,
		RedirectURL:  h.redirectURL,
		Endpoint:     oAuth2Provider.Endpoint(),
		Scopes:       []string{oidc.ScopeOpenID},
	}

	oauth2Token, err := oAuth2Config.Exchange(r.Context(), r.URL.Query().Get("code"))
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

	oidcVerifier := oAuth2Provider.Verifier(&oidc.Config{ClientID: h.clientID})
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

	session.accessToken = oauth2Token.AccessToken
	session.refreshToken = oauth2Token.RefreshToken
	session.subject = idToken.Subject
	session.username = claims.PreferredUsername

	echo(Log{"t": "login", "subject": session.subject, "username": session.username})

	h.sessions.set(sessionID, session)

	http.Redirect(w, r, session.successURL, http.StatusFound)
}

// OIDCLogoutHandler handles logout requests
type OIDCLogoutHandler struct {
	sessions      *OIDCSessions
	endSessionURL string
}

func newOIDCLogoutHandler(sessions *OIDCSessions, endSessionURL string) http.Handler {
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
