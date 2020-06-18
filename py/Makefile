all: build ## Build telesync wheel

.PHONY: build
build: purge
	./venv/bin/python3 setup.py bdist_wheel

publish: ## Publish package to PyPI
	./venv/bin/python -m twine upload dist/*

setup: ## Install dependencies
	python3 -m venv venv
	./venv/bin/python -m pip install --upgrade pip
	./venv/bin/python -m pip install setuptools wheel twine requests websockets faker
	./venv/bin/python -m pip install --editable telesync

.PHONY: docs
docs: ## Build API docs
	cd docs && $(MAKE) html

docs-zip: docs ## Build and package docs into a zip file
	cd docs/build/html && zip -r ../../../telesync-api-docs.zip .

purge: ## Purge previous build
	rm -rf build dist telesync.egg-info

clean: purge ## Clean
	rm -rf docs/build telesync-api-docs.zip venv

help: ## List all make tasks
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

