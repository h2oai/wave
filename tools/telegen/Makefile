all: build

.PHONY: build
build:
	./node_modules/.bin/tsc

setup:
	npm ci

run:
	node build/telegen.js ../../ui/src ../../py/telesync

clean:
	rm -rf build node_modules
