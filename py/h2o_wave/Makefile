.PHONY: build
build: purge
	H2O_WAVE_PLATFORM=win_amd64 ../venv/bin/python3 -m build --wheel
	H2O_WAVE_PLATFORM=manylinux1_x86_64 ../venv/bin/python3 -m build --wheel
	H2O_WAVE_PLATFORM=macosx_10_9_x86_64 ../venv/bin/python3 -m build --wheel
	H2O_WAVE_PLATFORM=macosx_11_0_arm64 ../venv/bin/python3 -m build --wheel
	H2O_WAVE_PLATFORM=macosx_12_0_arm64 ../venv/bin/python3 -m build --wheel
	../venv/bin/python3 -m build --wheel

build-conda: purge
	rm -rf temp_build ../build-conda/
# Mac arm64
	mkdir -p conda/temp
# rm -r conda/temp/examples conda/temp/demo conda/temp/test
	cp -a ../../build/wave-1.0.3-darwin-arm64/. conda/temp
	VERSION=1.0.3 H2O_WAVE_PLATFORM=macosx_12_0_arm64 conda build --output-folder temp_build/ conda
	mkdir -p ../build-conda/osx-arm64
	mv temp_build/noarch/*.tar.bz2 ../build-conda/osx-arm64
	rm -rf temp_build conda/temp

# Mac x86_64
	mkdir -p conda/temp
	cp -a ../../build/wave-1.0.3-darwin-amd64/. conda/temp
	VERSION=1.0.3 H2O_WAVE_PLATFORM=macosx_10_9_x86_64 conda build --output-folder temp_build/ conda
	mkdir -p ../build-conda/osx-64
	mv temp_build/noarch/*.tar.bz2 ../build-conda/osx-64
	rm -rf temp_build conda/temp

# Linux 64 (the same as 32)
	mkdir -p conda/temp
	cp -a ../../build/wave-1.0.3-linux-amd64/. conda/temp
	VERSION=1.0.3 H2O_WAVE_PLATFORM=manylinux1_x86_64 conda build --output-folder temp_build/ conda
	mkdir -p ../build-conda/linux-64
	mv temp_build/noarch/*.tar.bz2 ../build-conda/linux-64
	rm -rf temp_build conda/temp

# Windows 64 (TODO 32)
	mkdir -p conda/temp
	cp -a ../../build/wave-1.0.3-windows-amd64/. conda/temp
	VERSION=1.0.3 H2O_WAVE_PLATFORM=win_amd64 conda build --output-folder temp_build/ conda
	mkdir -p ../build-conda/win-64
	mv temp_build/noarch/*.tar.bz2 ../build-conda/win-64
	rm -rf temp_build conda/temp


purge: ## Purge previous build
	rm -f h2o_wave/metadata.py
	rm -rf build dist h2o_wave.egg-info