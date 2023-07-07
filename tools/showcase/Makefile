SHELL := bash
setup:
	mkdir -p ../../website/docs/widgets
	mkdir -p test/base test/compare test/diff
	python3 -m venv venv
	./venv/bin/python -m pip install --upgrade pip
	./venv/bin/python -m pip install -r requirements.txt
	./venv/bin/python -m playwright install 

generate-file:
	./venv/bin/python showcase.py --file $(FILE)

generate:
	./venv/bin/python showcase.py

visual-regression:
	rm -rf test/compare test/diff
	mkdir -p test/compare test/diff
	./venv/bin/python showcase.py --test

test-result:
	if [ -z "$$(find test/diff -type f -name '*.png')" ]; then echo "No diffs."; else ./venv/bin/python -m http.server; fi

update-snapshots:
	rm -rf test/base
	mv test/compare/ test/base/
	mkdir test/compare

clean-snapshots:
	rm -rf test/base test/compare test/diff
	mkdir -p test/base test/compare test/diff

clean:
	rm -rf venv
	rm -rf test
	rm -rf ../../website/docs/widgets 