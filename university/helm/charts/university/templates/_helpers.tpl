{{- define "university.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{- define "university.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{- define "university.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{- define "university.labels" -}}
helm.sh/chart: {{ include "university.chart" . }}
{{ include "university.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{- define "university.selectorLabels" -}}
app.kubernetes.io/name: {{ include "university.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{- define "university.import.auth.oidc.usernamePassword.secretName" -}}
{{- if .Values.import.auth.oidc.usernamePassword.existingSecret }}
{{- .Values.import.auth.oidc.usernamePassword.existingSecret }}
{{- else }}
{{- printf "%s-import-creds" (include "university.fullname" .) }}
{{- end }}
{{- end }}
