
setup:
	python3 -m venv venv
	./venv/bin/pip install -r requirements.txt
	./venv/bin/python -m pip install --editable ../py/h2o_wave
	./venv/bin/playwright install

test:
	./venv/bin/pytest -s --browser webkit --browser firefox --browser chromium

clean:
	rm -rf venv