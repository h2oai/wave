.PHONY: build
build: purge
	H2O_WAVE_PLATFORM=win_amd64 ../venv/bin/python3 -m build --wheel
	H2O_WAVE_PLATFORM=manylinux1_x86_64 ../venv/bin/python3 -m build --wheel
	H2O_WAVE_PLATFORM=macosx_10_9_x86_64 ../venv/bin/python3 -m build --wheel
	H2O_WAVE_PLATFORM=macosx_11_0_arm64 ../venv/bin/python3 -m build --wheel
	H2O_WAVE_PLATFORM=macosx_12_0_arm64 ../venv/bin/python3 -m build --wheel
	../venv/bin/python3 -m build --wheel

build-conda: purge
	mkdir -p conda/temp
	cp -a ../../build/wave-1.0.3-darwin-arm64/. conda/temp
	# rm -r conda/temp/examples
	# rm -r conda/temp/demo
	# rm -r conda/temp/test
	VERSION=1.0.3 H2O_WAVE_PLATFORM=macosx_12_0_arm64 conda build --output-folder temp_build/ conda
	rm -r conda/temp

purge: ## Purge previous build
	rm -f h2o_wave/metadata.py
	rm -rf build dist h2o_wave.egg-info