# Development

## Setup and Run

```sh
git clone https://github.com/h2oai/qd.git
cd qd
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

## Make tasks

```
all                            Setup and build everything
build                          Build everything
build-server                   Build server for current OS/Arch
build-ui                       Build UI
clean                          Clean
generate                       Generate driver bindings
help                           List all make tasks
release                        Prepare release builds
run                            Run server
run-ui                         Run UI in development mode (hot reloading)
setup                          Set up development dependencies
```
