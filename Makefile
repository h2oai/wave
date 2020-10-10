OS?=linux
VERSION ?= $(shell cat VERSION)
BUILD_DATE?=$(shell date '+%Y%m%d%H%M%S')
REL=qd-$(VERSION)-$(OS)-amd64
LDFLAGS := -ldflags '-X main.Version=$(VERSION) -X main.BuildDate=$(BUILD_DATE)'

all: clean setup build ## Setup and build everything

setup: ## Set up development dependencies
	$(MAKE) setup-lint
	cd ui && $(MAKE) setup
	cd py && $(MAKE) setup
	cd tools/qgen && $(MAKE) setup build

setup-lint: ## Setup linters
	npm ci

clean: ## Clean
	rm -rf build
	cd ui && $(MAKE) clean
	cd py && $(MAKE) clean
	cd tools/qgen && $(MAKE) clean
	rm -f qd

.PHONY: build
build: build-ui build-server ## Build everything

build-ui: ## Build UI
	cd ui && $(MAKE) build

run-ui: ## Run UI in development mode (hot reloading)
	cd ui && $(MAKE) run

test-ui-ci: ## Run UI unit tests in CI mode 
	cd ui && $(MAKE) test-ci

test-ui-watch: ## Run UI unit tests in CI mode 
	cd ui && $(MAKE) test

build-server: ## Build server for current OS/Arch
	go build $(LDFLAGS) -o qd cmd/qd/main.go

build-py: ## Build wheel
	cd py && $(MAKE) release

build-docker:
	docker build \
		--build-arg uid=$(shell id -u) \
		--build-arg gid=$(shell id -g) \
		-t qd-test:$(VERSION) \
		.

run: ## Run server
	go run cmd/qd/main.go -web-dir ./ui/build -debug

run-cypress-bridge: ## Run Cypress proxy
	go run cmd/qd/main.go -cypress

run-cypress: ## Run Cypress
	cd test && ./node_modules/.bin/cypress open

generate: ## Generate driver bindings
	cd tools/qgen && $(MAKE) run

.PHONY: docs
docs: ## Generate docs
	cd py && $(MAKE) docs

release: build-ui build-py ## Prepare release builds (use "VERSION=v1.2.3 make release)"
	$(MAKE) OS=linux release-os
	$(MAKE) OS=darwin release-os
	$(MAKE) OS=windows EXE_EXT=".exe" release-os
	$(MAKE) build-docs
	$(MAKE) release-docs

release-os:
	rm -rf build/$(REL)
	mkdir -p build/$(REL)
	rsync -a ui/build/ build/$(REL)/www
	rsync -a py/build/docs/h2o_q build/$(REL)/ && mv build/$(REL)/h2o_q build/$(REL)/docs
	rsync -a py/examples build/$(REL)/
	rm -rf test/cypress/integration/*.js
	rm -rf test/cypress/screenshots/*.*
	rm -rf test/cypress/videos/*.*
	rsync --exclude node_modules -a test build/$(REL)/
	GOOS=$(OS) GOARCH=amd64 go build $(LDFLAGS) -o build/$(REL)/qd$(EXE_EXT) cmd/qd/main.go
	cp readme-$(OS).txt build/$(REL)/readme.txt
	cd build && tar -czf $(REL).tar.gz  --exclude='*.state'  --exclude='__pycache__' $(REL)

build-docs:
	cd website && npm run build

release-docs:
	rm -rf docs && mkdir docs && rsync -a website/build/ docs/

help: ## List all make tasks
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'
