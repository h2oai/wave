setup:
	mkdir -p ../website/docs/showcase/assets
	python3 -m venv venv
	./venv/bin/python -m pip install --upgrade pip
	./venv/bin/python -m pip install -r requirements.txt
	./venv/bin/python -m playwright install

generate:
	./venv/bin/python showcase.py

clean:
	rm -rf venv