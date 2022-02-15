all: build

.PHONY: build
build:
	./node_modules/.bin/tsc

setup:
	npm ci

run:
	npx ts-node src/wavegen.ts ../../ui/src ../../py/h2o_wave ../../r/R

clean:
	rm -rf build node_modules
