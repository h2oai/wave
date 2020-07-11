all: build ## Build telesync wheel

.PHONY: build
build: purge
	sed -i -r -e "s/version.+/version='$(VERSION)',/" setup.py
	./venv/bin/python3 setup.py bdist_wheel

publish: ## Publish package to PyPI
	./venv/bin/python -m twine upload dist/*

setup: ## Install dependencies
	python3 -m venv venv
	./venv/bin/python -m pip install --upgrade pip
	./venv/bin/python -m pip install setuptools wheel twine requests websockets faker sphinx sphinx_rtd_theme
	./venv/bin/python -m pip install --editable .

.PHONY: docs
docs: ## Build API docs
	./venv/bin/sphinx-build -b html docs build

docs-zip: docs ## Build and package docs into a zip file
	cd docs/build/html && zip -r ../../../telesync-api-docs.zip .

purge: ## Purge previous build
	rm -rf build dist telesync.egg-info

.PHONY: examples
examples:
	sed -i -r -e "s/telesync.+/telesync==$(VERSION)/" examples/requirements.txt
	tar -czf examples.tar.gz --exclude='*.state' --exclude='__pycache__' examples/

clean: purge ## Clean
	rm -rf docs/build telesync-api-docs.zip venv
	rm -f examples.tar.gz

help: ## List all make tasks
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

