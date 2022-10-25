VERSION ?= $(shell cat ../VERSION)
# HACK: Linux uses GNU sed, while OSX uses BSD - need to install gsed to unify.
SED=$(shell command -v gsed || command -v sed)

setup: 
	python3 -m venv venv
	./venv/bin/python -m pip install --upgrade pip
	./venv/bin/python -m pip install -r requirements.txt

run:
	H2O_WAVE_PUBLIC_DIR="/assets/@../static/" venv/bin/wave run university.py --no-reload

build: # Prepare bundle for HAIC.
		rsync -a . tmp --exclude "venv" --exclude "*__pycache__*" --exclude "Makefile" --exclude ".gitignore"
		cp ../tools/vscode-extension/server/parser.py tmp/autocomplete_parser.py
		cp ../tools/vscode-extension/server/utils.py tmp/autocomplete_utils.py
		cp ../tools/vscode-extension/base-snippets.json tmp/static/base-snippets.json
		cp ../tools/vscode-extension/component-snippets.json tmp/static/component-snippets.json
		$(SED) -i -r -e "s/\{\{VERSION\}\}/$(VERSION)/g" tmp/app.toml
		mkdir -p ../build/apps/wave-university
		cd tmp && zip -r wave-university-$(VERSION).wave * && cd -
		mv tmp/wave-university-$(VERSION).wave ../build/apps/wave-university/
		rm -rf tmp

clean:
	rm -rf venv university.wave