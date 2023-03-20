# Test e2e
Set-Location e2e
.\venv\Scripts\pytest -s

Set-Location ..

# Test Py.
Set-Location py
# TODO: Convert to powershell.
# echo "Testing using BASE_URL" && H2O_WAVE_BASE_URL="/foo/" ./venv/bin/python -m tests
# echo "Testing using LOCAL UPLOAD" && H2O_WAVE_WAVED_DIR=".." ./venv/bin/python -m tests
# echo "Testing using LOCAL UPLOAD AND BASE URL" && H2O_WAVE_WAVED_DIR=".." H2O_WAVE_BASE_URL="/foo/" ./venv/bin/python -m tests

.\venv\Scripts\python -m tests

Set-Location ..

# Test VSC.
Set-Location tools\vscode-extension
.\venv\Scripts\python -m server.tests

Set-Location ..\..

# Test IntelliJ.
Set-Location tools\intellij-plugin
.\gradlew test