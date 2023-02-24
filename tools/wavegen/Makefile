all: build

.PHONY: build
build:
	./node_modules/.bin/tsc

setup:
	npm ci

run:
	npx ts-node src/wavegen.ts ../../ui/src ../../py/h2o_wave/h2o_wave ../../r/R
	cp ../../py/h2o_wave/h2o_wave/ui.py ../../py/h2o_lightwave/h2o_lightwave
	cp ../../py/h2o_wave/h2o_wave/types.py ../../py/h2o_lightwave/h2o_lightwave

clean:
	rm -rf build node_modules
