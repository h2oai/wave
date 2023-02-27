.PHONY: build
build:
	H2O_WAVE_BUILD_OS=windows ../venv/bin/python3 setup.py bdist_wheel --plat-name=win_amd64
	H2O_WAVE_BUILD_OS=linux ../venv/bin/python3 setup.py bdist_wheel --plat-name=manylinux1_x86_64
	H2O_WAVE_BUILD_OS=darwin ../venv/bin/python3 setup.py bdist_wheel --plat-name=macosx_10_9_x86_64
	H2O_WAVE_BUILD_OS=darwin H2O_WAVE_BUILD_ARCH=arm64 ../venv/bin/python3 setup.py bdist_wheel --plat-name=macosx_11_0_arm64
	H2O_WAVE_BUILD_OS=darwin H2O_WAVE_BUILD_ARCH=arm64 ../venv/bin/python3 setup.py bdist_wheel --plat-name=macosx_12_0_arm64
	H2O_WAVE_BUILD_OS=any ../venv/bin/python3 setup.py bdist_wheel

help: ## List all make tasks
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

