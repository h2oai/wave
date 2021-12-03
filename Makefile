OS?=linux
VERSION ?= $(shell cat VERSION)
BUILD_DATE?=$(shell date '+%Y%m%d%H%M%S')
REL=wave-$(VERSION)-$(OS)-amd64
LDFLAGS := -ldflags '-X main.Version=$(VERSION) -X main.BuildDate=$(BUILD_DATE)'

all: clean setup build ## Setup and build everything

setup: ## Set up development dependencies
	cd ui && $(MAKE) setup
	cd py && $(MAKE) setup
	cd tools/wavegen && $(MAKE) setup build
	cd tools/showcase && $(MAKE) setup

clean: ## Clean
	rm -rf build
	cd ui && $(MAKE) clean
	cd py && $(MAKE) clean
	cd tools/wavegen && $(MAKE) clean
	cd tools/showcase && $(MAKE) clean
	rm -f waved

setup-ts: ## Set up NPM package and symlinks
	cd ts && npm ci && npm run build
	cd ts && npm link
	cd ui && npm link h2o-wave

.PHONY: build
build: build-ui build-server ## Build everything

build-ui: ## Build UI
	cd ui && $(MAKE) build

build-ide: ## Build IDE
	cd ide && npm run build
	rm -rf ui/build/_ide
	mv ide/dist ui/build/_ide

generator: ## Build driver generator
	cd tools/wavegen && $(MAKE) build

run-ui: ## Run UI in development mode (hot reloading)
	cd ui && $(MAKE) run

test-ui-ci: ## Run UI unit tests in CI mode
	cd ui && $(MAKE) test-ci

test-ui-watch: ## Run UI unit tests
	cd ui && $(MAKE) test

build-server: ## Build server for current OS/Arch
	go build $(LDFLAGS) -o waved cmd/wave/main.go

build-db: ## Build database server for current OS/Arch
	go build $(LDFLAGS) -o wavedb cmd/wavedb/main.go

build-db-micro:
	go build -ldflags '-s -w -X main.Version=$(VERSION) -X main.BuildDate=$(BUILD_DATE)' -o wavedb cmd/wavedb/main.go
	upx --brute wavedb

release-db: # Build release package for database server
	mkdir -p build
	go build -ldflags '-X main.Version=$(VERSION) -X main.BuildDate=$(BUILD_DATE)' -o wavedb$(EXE_EXT) cmd/wavedb/main.go
	tar -czf wavedb-$(VERSION)-$(OS)-amd64.tar.gz wavedb$(EXE_EXT)

release-db-windows: # Build OSX release package for database server
	$(MAKE) OS=windows EXE_EXT=".exe" release-db

release-db-darwin: # Build OSX release package for database server
	$(MAKE) OS=darwin release-db

release-db-linux: # Build Linux release package for database server
	$(MAKE) OS=linux release-db

build-server-micro: ## Build smaller (~2M instead of ~10M) server executable
	go build -ldflags '-s -w -X main.Version=$(VERSION) -X main.BuildDate=$(BUILD_DATE)' -o waved cmd/wave/main.go
	upx --brute waved

build-py: ## Build h2o_wave wheel
	cd py && $(MAKE) build

build-docker:
	docker build \
		--build-arg uid=$(shell id -u) \
		--build-arg gid=$(shell id -g) \
		-t wave-test:$(VERSION) \
		.

run: ## Run server
	go run cmd/wave/main.go -web-dir ./ui/build -debug -editable -proxy -public-dir /assets/@./assets

run-db: ## Run database server
	go run cmd/wavedb/main.go

run-hb: ## Run handlebars frontend
	go run cmd/wave/main.go -web-dir ./x/handlebars

run-cypress: ## Run Cypress
	cd test && ./node_modules/.bin/cypress open

generate: ## Generate driver bindings
	cd tools/wavegen && $(MAKE) run

.PHONY: pydocs
pydocs: ## Generate API docs and copy to website
	cd py && $(MAKE) docs
	cd tools/showcase && $(MAKE) generate

release: build-ui build-py ## Prepare release builds (e.g. "VERSION=1.2.3 make release)"
	$(MAKE) OS=linux release-os
	$(MAKE) OS=darwin release-os
	$(MAKE) OS=windows EXE_EXT=".exe" release-os
	$(MAKE) website

release-os:
	rm -rf build/$(REL)
	mkdir -p build/$(REL)
	rsync -a ui/build/ build/$(REL)/www
	rsync -a py/examples build/$(REL)/
	rsync -a py/demo build/$(REL)/
	rm -rf test/cypress/integration/*.js
	rm -rf test/cypress/screenshots/*.*
	rm -rf test/cypress/videos/*.*
	rsync --exclude node_modules -a test build/$(REL)/
	GOOS=$(OS) GOARCH=amd64 go build $(LDFLAGS) -o build/$(REL)/waved$(EXE_EXT) cmd/wave/main.go
	cp readme.txt build/$(REL)/readme.txt
	cd build && tar -czf $(REL).tar.gz  --exclude='*.state'  --exclude='__pycache__' $(REL)

.PHONY: website
website: pydocs ## Build website
	cd website && npm ci && npm run build

preview-website: ## Preview website
	go run cmd/fs/main.go -web-dir website/build

publish-website: ## Publish website
	aws s3 sync website/build s3://wave.h2o.ai --delete

.PHONY: tag
tag: ## Bump version and tag
	cd py && $(MAKE) tag
	cd r && $(MAKE) tag
	git add .
	git commit -m "chore: Release v$(VERSION)"
	git tag v$(VERSION)
	git push origin && git push origin --tags

help: ## List all make tasks
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'
