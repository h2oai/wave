.PHONY: build
build: purge
	H2O_WAVE_PLATFORM=win_amd64 ../venv/bin/python3 -m build --wheel
	H2O_WAVE_PLATFORM=manylinux1_x86_64 ../venv/bin/python3 -m build --wheel
	H2O_WAVE_PLATFORM=macosx_10_9_x86_64 ../venv/bin/python3 -m build --wheel
	H2O_WAVE_PLATFORM=macosx_11_0_arm64 ../venv/bin/python3 -m build --wheel
	H2O_WAVE_PLATFORM=macosx_12_0_arm64 ../venv/bin/python3 -m build --wheel
	../venv/bin/python3 -m build --wheel

build-conda:
	mkdir -p conda/bin
	cp -a ../../build/wave-1.0.0-darwin-arm64/. conda/bin
	# rm -r conda/bin/examples
	# rm -r conda/bin/demo
	# rm -r conda/bin/test
	VERSION=1.0.0 H2O_WAVE_PLATFORM=macosx_12_0_arm64 conda build --output-folder temp_build/ conda
	rm -r conda/bin

purge: ## Purge previous build
	rm -f h2o_wave/metadata.py
	rm -rf build dist h2o_wave.egg-info