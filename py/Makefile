all: build ## Build h2o_wave wheel

.PHONY: build
build: purge
	sed -i -r -e "s/version.+/version='$(VERSION)',/" setup.py
	./venv/bin/python3 setup.py bdist_wheel

setup: ## Install dependencies
	python3 -m venv venv
	./venv/bin/python -m pip install --upgrade pip
	./venv/bin/python -m pip install setuptools wheel httpx uvicorn starlette pdoc3 pytest flake8
	./venv/bin/python -m pip install -r examples/requirements.txt
	./venv/bin/python -m pip install --editable .

.PHONY: docs
docs: ## Build API docs
	./venv/bin/pdoc --force  --template-dir docs/templates --output-dir build/docs h2o_wave
	mkdir -p ../website/docs/api/
	mv build/docs/h2o_wave/* ../website/docs/api/
	./venv/bin/python sync_examples.py

purge: ## Purge previous build
	rm -rf build dist h2o_wave.egg-info

.PHONY: examples
examples:
	sed -i -r -e "s/h2o_wave.+/h2o_wave==$(VERSION)/" examples/requirements.txt

.PHONY: release
release: build examples ## Prepare release artifacts

clean: purge ## Clean
	rm -rf docs/build venv

help: ## List all make tasks
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

