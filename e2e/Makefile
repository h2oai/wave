
setup:
	python3 -m venv venv
	./venv/bin/pip install --upgrade pip
	./venv/bin/pip install -r requirements.txt
	./venv/bin/python -m pip install --editable ../py/h2o_wave
	./venv/bin/playwright install

run-kc:
	docker build -t keycloak -f keycloak.dockerfile . 
	docker run --rm -p 8080:8080 keycloak:latest

test-dev:
	 SKIP_KC=1 ./venv/bin/pytest -s

test:
	./venv/bin/pytest -x --browser firefox --browser chromium

test-macos:
	./venv/bin/pytest -x --browser webkit --browser firefox --browser chromium

clean:
	rm -rf venv