build_conda_package = \
	if [ "$(1)" != "noarch" ]; then \
		mkdir -p conda/temp && \
		cp -a ../../build/wave-$(VERSION)-$(1)/. conda/temp; \
	fi && \
	conda build --output-folder temp_build/ conda && \
	mkdir -p sdist/$(2) && \
	mv temp_build/noarch/*.tar.bz2 sdist/$(2) && \
	rm -rf temp_build conda/temp

.PHONY: build
build: purge
	H2O_WAVE_PLATFORM=win_amd64 ../venv/bin/python3 -m build --wheel
	H2O_WAVE_PLATFORM=manylinux1_x86_64 ../venv/bin/python3 -m build --wheel
	H2O_WAVE_PLATFORM=macosx_10_9_x86_64 ../venv/bin/python3 -m build --wheel
	H2O_WAVE_PLATFORM=macosx_11_0_arm64 ../venv/bin/python3 -m build --wheel
	H2O_WAVE_PLATFORM=macosx_12_0_arm64 ../venv/bin/python3 -m build --wheel
	../venv/bin/python3 -m build --wheel
	$(call build_conda_package,darwin-arm64,osx-arm64)
	$(call build_conda_package,darwin-amd64,osx-64)
	$(call build_conda_package,linux-amd64,linux-64)
	$(call build_conda_package,windows-amd64,win-64)
	$(call build_conda_package,noarch,noarch)

purge: ## Purge previous build
	rm -rf build dist sdist h2o_wave.egg-info temp_build conda/temp h2o_wave/metadata.py