# Test e2e
Set-Location e2e
.\venv\Scripts\pytest -s

Set-Location ..

# Test UI.
Set-Location ui
npm run test:ci

Set-Location ..

# Test Py.
Set-Location py
.\venv\Scripts\python -m tests

Set-Location ..

# Test VSC.
Set-Location tools\vscode-extension
.\venv\Scripts\python -m server.tests

Set-Location ..\..

# Test IntelliJ.
Set-Location tools\intellij-plugin
.\gradlew test