# Setup UI.
Set-Location ui
npm ci
npm run build

Set-Location ..

# Setup Py tests.
Set-Location py
python -m venv venv
.\venv\Scripts\python -m pip install --editable h2o_wave
.\venv\Scripts\pip install httpx

Set-Location ..

# Setup VSC.
Set-Location tools\vscode-extension
npm ci
python -m venv venv
.\venv\Scripts\python -m pip install --upgrade pip
.\venv\Scripts\python -m pip install -r requirements.txt
npm run compile

Set-Location ..\..

# Setup e2e.
Set-Location e2e
python -m venv venv
.\venv\Scripts\python -m pip install -r requirements.txt
.\venv\Scripts\python -m pip install --editable ..\py\h2o_wave
.\venv\Scripts\playwright install

Set-Location ..

# Build waved.
go build -ldflags '-X main.Version=DEV -X main.BuildDate=20230317152454' -o waved cmd/wave/main.go