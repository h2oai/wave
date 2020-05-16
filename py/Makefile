all: ## Build telesync wheel
	./venv/bin/python3 setup.py bdist_wheel

setup: ## Install dependencies
	python3 -m venv venv
	./venv/bin/python -m pip install -U pip
	./venv/bin/python -m pip install wheel requests websockets faker

.PHONY: docs
docs: ## Build API docs
	cd docs && $(MAKE) html

docs-zip: docs ## Build and package docs into a zip file
	cd docs/build/html && zip -r ../../../telesync-api-docs.zip .

clean: ## Clean
	rm -rf build dist docs/build telesync-api-docs.zip telesync.egg-info venv

help: ## List all make tasks
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

