WAVE_ML_VERSION := v0.6.0

all: build ## Build h2o_wave wheel

.PHONY: build
build: purge
	./venv/bin/python3 setup.py bdist_wheel

setup: ## Install dependencies
	git clone --depth 1 --branch $(WAVE_ML_VERSION) https://github.com/h2oai/wave-ml.git h2o_wave_ml
	python3 -m venv venv
	./venv/bin/python -m pip install --upgrade pip
	./venv/bin/python -m pip install setuptools wheel httpx uvicorn starlette pdoc3 pytest flake8
	./venv/bin/python -m pip install h2o_wave_ml/
	# TODO examples pip install is wasteful for CI
	./venv/bin/python -m pip install -r examples/requirements.txt
	./venv/bin/python -m pip install --editable .

.PHONY: docs
docs: ## Build API docs
	./venv/bin/pdoc --force  --template-dir docs/templates --output-dir build/docs h2o_wave
	./venv/bin/pdoc --force  --template-dir docs/templates --output-dir build/docs h2o_wave_ml/h2o_wave_ml
	mkdir -p ../website/docs/api/h2o_wave_ml
	mv build/docs/h2o_wave/* ../website/docs/api/
	mv build/docs/h2o_wave_ml/* ../website/docs/api/h2o_wave_ml/
	./venv/bin/python sync_examples.py

purge: ## Purge previous build
	rm -rf build dist h2o_wave.egg-info

clean: purge ## Clean
	rm -rf docs/build venv h2o_wave_ml

.PHONY: tag
tag: # Bump version
	sed -i -r -e "s/version.+/version='$(VERSION)',/" setup.py
	sed -i -r -e "s/__version__.+/__version__ = '$(VERSION)'/" h2o_wave/__init__.py
	# Causes chicken-egg situation during CI
	# sed -i -r -e "s/h2o_wave.+/h2o_wave==$(VERSION)/" examples/requirements.txt

help: ## List all make tasks
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

