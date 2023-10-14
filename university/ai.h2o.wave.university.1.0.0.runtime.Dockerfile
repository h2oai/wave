FROM 524466471676.dkr.ecr.us-east-1.amazonaws.com/q8s/launcher:v0.23.0-gpu38

WORKDIR /app/

# Create a virtual environment
RUN python3 -m venv /app/venv

LABEL \
	# Version of the bundle cmd used to generate this Dockerfile
	ai.h2o.appstore.bundle.version = 0.0.1 \
	# App name as defined in the app.toml
	ai.h2o.appstore.app.name = "ai.h2o.wave.university" \
	# App version as defined in the app.toml
	ai.h2o.appstore.app.version = "1.0.0"

# Unpack .wave bundle
RUN --mount=type=bind,src=ai.h2o.wave.university.1.0.0.wave,target=/app/ai.h2o.wave.university.1.0.0.wave \
	unzip ai.h2o.wave.university.1.0.0.wave || UNZIP_EXIT_CODE=$? && \
	# Ignore exit code 2, seems to be a false positive
	if [ $UNZIP_EXIT_CODE != 0 ] && [ $UNZIP_EXIT_CODE != 2 ]; then echo "unzip failed with exit code $UNZIP_EXIT_CODE"; exit $UNZIP_EXIT_CODE; fi

# Install Python dependencies
RUN --mount=type=cache,target=/home/.cache \
	--mount=type=cache,target=/root/.cache \
	--mount=type=cache,target=/.cache \
	/app/venv/bin/pip3 install -r requirements.txt

# Path to the venv directory
ENV H2O_CLOUD_VENV_PATH /app/venv
# Path to the app directory
ENV H2O_CLOUD_APP_ROOT /app
# App main module
ENV H2O_CLOUD_PY_MODULE=h2o_wave_university.university
