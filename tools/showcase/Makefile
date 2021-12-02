setup:
	mkdir -p ../../website/docs/components
	mkdir -p test/base test/compare test/diff
	python3 -m venv venv
	./venv/bin/python -m pip install --upgrade pip
	./venv/bin/python -m pip install -r requirements.txt
	./venv/bin/python -m playwright install

generate:
	./venv/bin/python showcase.py $(FILES)

clean:
	rm -rf venv
	rm -rf test
	rm -rf ../../website/docs/components
