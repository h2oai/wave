setup:
	python3 -m venv venv
	./venv/bin/python -m pip install --upgrade pip
	./venv/bin/python -m pip install -r requirements.txt

generate:
	./venv/bin/python showcase.py components
	./venv/bin/python showcase.py cards

clean:
	rm -rf venv