
setup: 
	python3 -m venv venv
	./venv/bin/python -m pip install --upgrade pip
	./venv/bin/python -m pip install -r requirements.txt

run:
	H2O_WAVE_PUBLIC_DIR="/assets/@../static" venv/bin/wave run studio.py --no-reload

clean:
	rm -rf venv