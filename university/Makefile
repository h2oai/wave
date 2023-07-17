VERSION ?= $(shell cat ../VERSION)
# HACK: Linux uses GNU sed, while OSX uses BSD - need to install gsed to unify.
SED=$(shell command -v gsed || command -v sed)

setup: 
	python3 -m venv venv
	./venv/bin/python -m pip install --upgrade pip
	./venv/bin/python -m pip install -r requirements.txt
	./venv/bin/python -m pip install build

run:
	H2O_WAVE_PUBLIC_DIR="/assets/@../h2o_wave_university/static/" venv/bin/wave run h2o_wave_university/university.py --no-reload

.PHONY: build
build: # Prepare bundle for HAIC.
		rsync -a . tmp --exclude "venv" --exclude "*__pycache__*" --exclude "Makefile" --exclude ".gitignore" --exclude "dist" --exclude "build"
		cp ../tools/vscode-extension/server/parser.py tmp/h2o_wave_university/autocomplete_parser.py
		cp ../tools/vscode-extension/server/utils.py tmp/h2o_wave_university/autocomplete_utils.py
		cp ../tools/vscode-extension/base-snippets.json tmp/h2o_wave_university/static/base-snippets.json
		cp ../tools/vscode-extension/component-snippets.json tmp/h2o_wave_university/static/component-snippets.json
		$(SED) -i -r -e "s/\{\{VERSION\}\}/$(VERSION)/g" tmp/app.toml
		mkdir -p ../build/apps/wave-university
		cd tmp && zip -r wave-university-$(VERSION).wave * && cd -
		mv tmp/wave-university-$(VERSION).wave ../build/apps/wave-university/
		rm -rf tmp

build-pypi: purge # For PyPi publish.
	venv/bin/python3 -m build --wheel

tag:
	$(SED) -i -r -e "s/__version__.+/__version__ = '$(VERSION)'/" h2o_wave_university/version.py

publish:
	$(MAKE) setup
	$(MAKE) build-pypi

clean:
	rm -rf venv university.wave
	$(MAKE) purge

purge:
	rm -rf dist build