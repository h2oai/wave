
```
   __       __                          
  / /____  / /__  _______  ______  _____
 / __/ _ \/ / _ \/ ___/ / / / __ \/ ___/
/ /_/  __/ /  __(__  ) /_/ / / / / /__  
\__/\___/_/\___/____/\__, /_/ /_/\___/  
                    /____/              
```

Q Realtime App SDK

- Realtime cache module
- Development server
- UI components
- Python driver

Issues: https://github.com/h2oai/q/issues

## Development

### Setup and Run

```sh
git clone https://github.com/h2oai/telesync.git
cd telesync
make
make run
```

### Daily Development

- `make run`
- `make run-ui`
- Open root directory in Visual Studio Code.
- Open `py/` in PyCharm.

### Make tasks

```
all                            Setup and build everything
build                          Build everything
build-db                       Build database
build-py                       Build Python driver
build-server                   Build server
build-ui                       Build UI
clean                          Clean
help                           List all make tasks
run-db                         Run database
run                            Run server
run-ui                         Run UI in development mode (hot reloading)
setup                          Set up development dependencies
```