OS?=linux
VERSION?=dev
BUILD_DATE?=$(shell date '+%Y%m%d%H%M%S')
REL=telesync-$(VERSION)-$(OS)-amd64
LDFLAGS := -ldflags '-X main.Version=$(VERSION) -X main.BuildDate=$(BUILD_DATE)'

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

build-server: ## Build server for current OS/Arch
	go build $(LDFLAGS) -o telesync cmd/telesync/main.go

build-examples:
	cd py && $(MAKE) examples

run: ## Run server
	go run cmd/telesync/main.go -web-dir ./ui/build -debug

generate: ## Generate driver bindings
	cd tools/telegen && $(MAKE) run

release: build-ui build-examples ## Prepare release builds (use "VERSION=v1.2.3 make release"
	$(MAKE) OS=linux release-os
	$(MAKE) OS=darwin release-os
	$(MAKE) OS=windows release-os

release-os:
	rm -rf build/$(REL)
	mkdir -p build/$(REL)
	rsync -a ui/build/ build/$(REL)/www
	GOOS=$(OS) GOARCH=amd64 go build $(LDFLAGS) -o build/$(REL)/telesync cmd/telesync/main.go
	cp py/examples.tar.gz build/$(REL)/
	cp release.txt build/$(REL)/readme.txt
	cd build && tar -czf $(REL).tar.gz $(REL)

help: ## List all make tasks
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'
