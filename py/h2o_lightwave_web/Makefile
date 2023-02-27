.PHONY: build
build: purge
	cp -R ../../ui/build h2o_lightwave_web/www
	../venv/bin/python setup.py bdist_wheel

purge:
	rm -rf h2o_lightwave_web/www build dist h2o_lightwave_web.egg-info