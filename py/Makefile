WAVE_ML_VERSION := v0.8.0
# HACK: Linux uses GNU sed, while OSX uses BSD - need to install gsed to unify.
SED=$(shell command -v gsed || command -v sed)

all: build ## Build h2o_wave wheel

.PHONY: build
build: purge
	# H2O_WAVE_BUILD_OS=windows ./venv/bin/python3 setup.py bdist_wheel --plat-name=win_amd64
	# H2O_WAVE_BUILD_OS=linux ./venv/bin/python3 setup.py bdist_wheel --plat-name=manylinux1_x86_64
	# H2O_WAVE_BUILD_OS=darwin ./venv/bin/python3 setup.py bdist_wheel --plat-name=macosx_10_9_x86_64
	# H2O_WAVE_BUILD_OS=darwin H2O_WAVE_BUILD_ARCH=arm64 ./venv/bin/python3 setup.py bdist_wheel --plat-name=macosx_11_0_arm64
	# H2O_WAVE_BUILD_OS=darwin H2O_WAVE_BUILD_ARCH=arm64 ./venv/bin/python3 setup.py bdist_wheel --plat-name=macosx_12_0_arm64
	# H2O_WAVE_BUILD_OS=any ./venv/bin/python3 setup.py bdist_wheel
	./venv/bin/python3 setup_wavelite.py bdist_wheel

setup: ## Install dependencies
	git clone --depth 1 --branch $(WAVE_ML_VERSION) https://github.com/h2oai/wave-ml.git h2o_wave_ml
	python3 -m venv venv
	./venv/bin/python -m pip install --upgrade pip
	./venv/bin/python -m pip install setuptools wheel httpx uvicorn starlette pdoc3 flake8
	./venv/bin/python -m pip install h2o_wave_ml/
	# TODO examples pip install is wasteful for CI
	./venv/bin/python -m pip install -r examples/requirements.txt
	./venv/bin/python -m pip install --editable .
	rm -f h2o_wave/metadata.py
	echo "# Generated in setup.py\n__platform__ = 'linux'\n__arch__ = 'amd64'" > h2o_wave/metadata.py

.PHONY: docs
docs: ## Build API docs
	./venv/bin/pdoc --force  --template-dir docs/templates --output-dir build/docs h2o_wave
	./venv/bin/pdoc --force  --template-dir docs/templates --output-dir build/docs h2o_wave_ml/h2o_wave_ml
	mkdir -p ../website/docs/api/h2o_wave_ml
	mv build/docs/h2o_wave/* ../website/docs/api/
	mv build/docs/h2o_wave_ml/* ../website/docs/api/h2o_wave_ml/
	./venv/bin/python sync_examples.py

test:
	./venv/bin/python -m tests
	echo "Testing using BASE_URL" && H2O_WAVE_BASE_URL="/foo/" ./venv/bin/python -m tests
	echo "Testing using LOCAL UPLOAD" && H2O_WAVE_WAVED_DIR=".." ./venv/bin/python -m tests
	echo "Testing using LOCAL UPLOAD AND BASE URL" && H2O_WAVE_WAVED_DIR=".." H2O_WAVE_BASE_URL="/foo/" ./venv/bin/python -m tests

purge: ## Purge previous build
	rm -rf build dist h2o_wave.egg-info

clean: purge ## Clean
	rm -rf docs/build venv h2o_wave_ml

.PHONY: tag
tag: # Bump version
	$(SED) -i -r -e "s/__version__.+/__version__ = '$(VERSION)'/" h2o_wave/version.py

help: ## List all make tasks
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

