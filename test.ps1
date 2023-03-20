$ErrorActionPreference = "Stop"

# Test e2e
# Set-Location e2e
# .\venv\Scripts\pytest -s
# if ($LastExitCode -ne 0) { exit $LastExitCode }

# Set-Location ..

# Test Py.
Set-Location py
.\venv\Scripts\python -m tests
if ($LastExitCode -ne 0) { exit $LastExitCode }
$env:H2O_WAVE_BASE_URL= '/foo/'; .\venv\Scripts\python -m tests
if ($LastExitCode -ne 0) { exit $LastExitCode }
$env:H2O_WAVE_WAVED_DIR='..'; .\venv\Scripts\python -m tests
if ($LastExitCode -ne 0) { exit $LastExitCode }
$env:H2O_WAVE_WAVED_DIR='..'; $env:H2O_WAVE_BASE_URL='/foo/'; .\venv\Scripts\python -m tests
if ($LastExitCode -ne 0) { exit $LastExitCode }

Set-Location ..

# Test VSC.
Set-Location tools\vscode-extension
.\venv\Scripts\python -m server.tests
if ($LastExitCode -ne 0) { exit $LastExitCode }

Set-Location ..\..

# Test IntelliJ.
Set-Location tools\intellij-plugin
.\gradlew test
if ($LastExitCode -ne 0) { exit $LastExitCode }