ifneq ($(origin VERSION), undefined)
	LDFLAGS := -ldflags '-X github.com/h2oai/telesync/build.Date=$(BUILD_DATE) -X github.com/h2oai/telesync/build.Version=$(VERSION) -X github.com/h2oai/telesync/build.ID=$(BUILD_ID)'
endif

all: clean setup build ## Setup and build everything

setup: ## Set up development dependencies
	cd ui && $(MAKE) setup
	cd py && $(MAKE) setup
	cd tools/telegen && $(MAKE) setup build

clean: ## Clean
	rm -rf build
	cd ui && $(MAKE) clean
	cd py && $(MAKE) clean
	cd tools/telegen && $(MAKE) clean
	rm -f telesync

.PHONY: build
build: build-ui build-server ## Build everything

build-ui: ## Build UI
	cd ui && $(MAKE) build

run-ui: ## Run UI in development mode (hot reloading)
	cd ui && $(MAKE) run


build-server: ## Build server
	go build ${LDFLAGS} -o telesync cmd/telesync/main.go

run: ## Run server
	go run cmd/telesync/main.go -webroot ./ui/build

generate: ## Generate driver bindings
	cd tools/telegen && $(MAKE) run

release: clean-build build ## Prepare release build
	mkdir -p build/telesync
	rsync -a ui/build/ build/telesync/www
	cp telesync build/telesync
	cp release.txt build/telesync/readme.txt
	cd build && tar -czf telesync.tar.gz telesync

help: ## List all make tasks
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'
