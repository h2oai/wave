# Setup UI.
Set-Location ui
npm ci
npm run build
if ($LastExitCode -ne 0) { exit $LastExitCode }

Set-Location ..

# Setup Py tests.
Set-Location py
python -m venv venv
.\venv\Scripts\python -m pip install --editable h2o_wave
.\venv\Scripts\python -m pip install --upgrade pip
.\venv\Scripts\pip install httpx
if ($LastExitCode -ne 0) { exit $LastExitCode }

Set-Location ..

# Setup VSC.
Set-Location tools\vscode-extension
npm ci
python -m venv venv
.\venv\Scripts\python -m pip install --upgrade pip
.\venv\Scripts\python -m pip install -r requirements.txt
npm run compile
if ($LastExitCode -ne 0) { exit $LastExitCode }

Set-Location ..\..

# Build waved.
go build -ldflags '-X main.Version=DEV -X main.BuildDate=20230317152454' -o waved cmd/wave/main.go
if ($LastExitCode -ne 0) { exit $LastExitCode }