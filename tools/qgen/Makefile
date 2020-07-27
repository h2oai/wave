all: build

.PHONY: build
build:
	./node_modules/.bin/tsc

setup:
	npm ci

run:
	node build/qgen.js ../../ui/src ../../py/h2o_q

clean:
	rm -rf build node_modules
