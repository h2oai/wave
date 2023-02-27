.PHONY: build
build: purge
	H2O_WAVE_BUILD_OS=windows ../venv/bin/python3 setup.py bdist_wheel --plat-name=win_amd64
	H2O_WAVE_BUILD_OS=linux ../venv/bin/python3 setup.py bdist_wheel --plat-name=manylinux1_x86_64
	H2O_WAVE_BUILD_OS=darwin ../venv/bin/python3 setup.py bdist_wheel --plat-name=macosx_10_9_x86_64
	H2O_WAVE_BUILD_OS=darwin H2O_WAVE_BUILD_ARCH=arm64 ../venv/bin/python3 setup.py bdist_wheel --plat-name=macosx_11_0_arm64
	H2O_WAVE_BUILD_OS=darwin H2O_WAVE_BUILD_ARCH=arm64 ../venv/bin/python3 setup.py bdist_wheel --plat-name=macosx_12_0_arm64
	H2O_WAVE_BUILD_OS=any ../venv/bin/python3 setup.py bdist_wheel

purge: ## Purge previous build
	rm -rf build dist h2o_wave.egg-info