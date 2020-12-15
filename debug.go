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
	  <div><strong>Apps</strong><div>
		{{range .Apps}}<div><a href="{{ . }}">{{ . }}</a></div>{{else}}<div>No apps.</div>{{end}}
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
		Apps  []string
		Pages []string
	}{
		Apps:  h.broker.routes(),
		Pages: h.broker.site.urls(),
	}
	h.siteTemplate.Execute(w, data)
}
