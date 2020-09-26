all: build ## Build h2o_q wheel

.PHONY: build
build: purge
	sed -i -r -e "s/version.+/version='$(VERSION)',/" setup.py
	./venv/bin/python3 setup.py bdist_wheel

publish: ## Publish package to PyPI
	./venv/bin/python -m twine upload dist/*

setup: ## Install dependencies
	python3 -m venv venv
	./venv/bin/python -m pip install --upgrade pip
	./venv/bin/python -m pip install setuptools wheel twine requests websockets pdoc3 pytest flake8
	./venv/bin/python -m pip install -r examples/requirements.txt
	./venv/bin/python -m pip install --editable .

.PHONY: docs
docs: ## Build API docs
	./venv/bin/pdoc --force  --template-dir docs/templates --output-dir build/docs h2o_q
	mv build/docs/h2o_q/* ../website/docs/api/

purge: ## Purge previous build
	rm -rf build dist h2o_q.egg-info

.PHONY: examples
examples:
	sed -i -r -e "s/h2o_q.+/h2o_q==$(VERSION)/" examples/requirements.txt

.PHONY: release
release: build docs examples ## Prepare release artifacts

clean: purge ## Clean
	rm -rf docs/build h2o_q-api-docs.zip venv
	rm -f examples.tar.gz

help: ## List all make tasks
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

