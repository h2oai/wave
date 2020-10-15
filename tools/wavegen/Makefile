all: build

.PHONY: build
build:
	./node_modules/.bin/tsc

setup:
	npm ci

run:
	node build/wavegen.js ../../ui/src ../../py/h2o_wave ../../r/R

clean:
	rm -rf build node_modules
