package wave

import (
	"net/http"
	"text/template"
)

const siteTemplate = `
<!DOCTYPE html>
<html>
	<head>
		<meta charset="UTF-8">
		<title>Site Profile</title>
	</head>
	<body style="font-family:monospace">
	  <div><strong>Relays</strong><div>
		{{range .Relays}}<div><a href="{{ . }}">{{ . }}</a></div>{{else}}<div>No relays.</div>{{end}}
	  <div><strong>Pages</strong><div>
		{{range .Pages}}<div><a href="{{ . }}">{{ . }}</a></div>{{else}}<div>No pages.</div>{{end}}
	</body>
</html>`

// DebugHandler is a HTTP handler for site profiling.
type DebugHandler struct {
	broker       *Broker
	siteTemplate *template.Template
}

func newDebugHandler(broker *Broker) *DebugHandler {
	return &DebugHandler{
		broker,
		template.Must(template.New("site").Parse(siteTemplate)),
	}
}

func (h *DebugHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	data := struct {
		Relays []string
		Pages  []string
	}{
		Relays: h.broker.urls(),
		Pages:  h.broker.site.urls(),
	}
	h.siteTemplate.Execute(w, data)
}
