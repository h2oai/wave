# Development

## Setup and Run

```sh
git clone https://github.com/h2oai/wave.git
cd wave
make
make run
```

## Daily Development

- `make run`
- `make run-ui`
- Open root directory in Visual Studio Code.
- Open `py/` in PyCharm.

## Developing apps using bleeding edge

Clone this repo and install into your app's `venv` using pip's `--editable` option `pip install -e`.

For example `./venv/bin/pip install -e path/to/git/qd/py/`.

## Cut a release

(Needs automation!)

Update `website/docs/change-log.md`, then:

```
VERSION=v1.2.3 make release
git add .
git commit -m "Release v1.2.3"
git tag v1.2.3
git push --tags
make publish-pypi
```

Finally, add release packages from `build/` to Github releases.

## Make tasks

```
$ make help
```

```
all                            Setup and build everything
build                          Build everything
build-py                       Build h2o_wave wheel
build-server                   Build server for current OS/Arch
build-ui                       Build UI
build-website                  Build website
clean                          Clean
docs                           Generate API docs and copy to website
generate                       Generate driver bindings
help                           List all make tasks
publish-pypi                   Publish PyPI package
publish-website                Publish website
release                        Prepare release builds (e.g. "VERSION=v1.2.3 make release)"
run-cypress                    Run Cypress
run                            Run server
run-ui                         Run UI in development mode (hot reloading)
setup-lint                     Setup linters
setup                          Set up development dependencies
test-ui-ci                     Run UI unit tests in CI mode
test-ui-watch                  Run UI unit tests
```