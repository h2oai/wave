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
	./venv/bin/python -m pip install setuptools wheel twine requests websockets sphinx sphinx_rtd_theme pytest pylint seleniumbase
	./venv/bin/python -m pip install -r examples/requirements.txt
	./venv/bin/python -m pip install --editable .
	./venv/bin/seleniumbase install chromedriver latest 

.PHONY: docs
docs: sync-examples ## Build API docs
	./venv/bin/pdoc --force --html --template-dir docs/templates --output-dir build/docs h2o_q
	cp ../q.png build/docs/h2o_q/

purge: ## Purge previous build
	rm -rf build dist h2o_q.egg-info

.PHONY: examples
examples:
	sed -i -r -e "s/h2o_q.+/h2o_q==$(VERSION)/" examples/requirements.txt

sync-examples:
	rm -f docs/example*.md
	./venv/bin/python docs/sync_examples.py

.PHONY: release
release: build docs examples ## Prepare release artifacts

clean: purge ## Clean
	rm -rf docs/build h2o_q-api-docs.zip venv
	rm -f examples.tar.gz

test:
	pytest

test-ci:
	mkdir -p reports
	pytest --headless --junit-xml=reports/report.xml --html=reports/report.html

help: ## List all make tasks
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

