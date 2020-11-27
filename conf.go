package wave

// ServerConf represents Server configuration options.
type ServerConf struct {
	Version           string
	BuildDate         string
	Listen            string
	WebDir            string
	DataDir           string
	AccessKeyID       string
	AccessKeySecret   string
	Init              string
	Compact           string
	CertFile          string
	KeyFile           string
	Debug             bool
	OIDCClientID      string
	OIDCClientSecret  string
	OIDCProviderURL   string
	OIDCRedirectURL   string
	OIDCEndSessionURL string
	OIDCSkipLoginPage bool
}

func (c *ServerConf) oidcEnabled() bool {
	return c.OIDCClientID != "" && c.OIDCClientSecret != "" && c.OIDCProviderURL != "" && c.OIDCRedirectURL != ""
}
