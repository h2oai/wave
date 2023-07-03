SED=$(shell command -v gsed || command -v sed)

# Make sure to build against python 3.8 to achieve the highest compatibility.
build:
	mkdir deps
	cp -r venv/lib/*/site-packages/* deps
	npm run build
	rm -rf deps

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

tag: # Bump version
	$(SED) -i -r -e 's/"version": .+/"version": "$(VERSION)",/' package.json

publish:
	$(MAKE) test
	$(MAKE) build
	npx vsce package --packagePath *.vsix

clean:
	rm -rf venv
