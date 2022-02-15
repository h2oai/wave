build:
	npm run build

setup:
	npm ci
	python3 -m venv venv
	./venv/bin/python -m pip install --upgrade pip
	./venv/bin/python -m pip install -r requirements.txt
	npm run compile

run-server:
	./venv/bin/python -m server --tcp

run-client:
	npm run compile && code --extensionDevelopmentPath=$(shell pwd)

test:
	./venv/bin/python -m server.tests

clean:
	rm -rf venv
