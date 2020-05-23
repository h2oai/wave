all:
	./node_modules/.bin/tsc

setup:
	npm ci

run:
	node build/telegen.js ../../ui/src/cards ../../py/telesync/cards.py

clean:
	rm -rf build node_modules
