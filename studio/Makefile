VERSION ?= $(shell cat ../VERSION)

setup: 
	python3 -m venv venv
	./venv/bin/python -m pip install --upgrade pip
	./venv/bin/python -m pip install -r requirements.txt

run:
	H2O_WAVE_PUBLIC_DIR="/assets/@../static" venv/bin/wave run studio.py --no-reload

build: # Prepare bundle for HAIC.
		mkdir -p tmp
		cp ../tools/vscode-extension/server/parser.py tmp/autocomplete_parser.py
		cp ../tools/vscode-extension/server/utils.py tmp/autocomplete_utils.py
		cp ../tools/vscode-extension/base-snippets.json tmp/base-snippets.json
		cp ../tools/vscode-extension/component-snippets.json tmp/component-snippets.json
		rsync -a . tmp --exclude "venv" --exclude "*__pycache__*" --exclude "Makefile" --exclude ".gitignore"
		find tmp -type f -name '*.toml' -exec sed -i'' -e "s/{{VERSION}}/$(VERSION)/g" {} \;
		cd tmp && zip -r ../wave-studio-$(VERSION).wave * && cd -
		rm -rf tmp
		mkdir -p ../build/apps/wave-studio
		mv wave-studio-$(VERSION).wave ../build/apps/wave-studio/

clean:
	rm -rf venv studio.wave