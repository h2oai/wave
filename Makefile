OS?=linux
VERSION ?= $(shell cat VERSION)
BUILD_DATE?=$(shell date '+%Y%m%d%H%M%S')
REL=wave-$(VERSION)-$(OS)-amd64
LDFLAGS := -ldflags '-X main.Version=$(VERSION) -X main.BuildDate=$(BUILD_DATE)'

all: clean setup build ## Setup and build everything

setup: ## Set up development dependencies
	$(MAKE) setup-git-hooks
	cd ui && $(MAKE) setup
	cd py && $(MAKE) setup
	cd tools/wavegen && $(MAKE) setup build

setup-git-hooks: ## Setup GIT hooks
	cp githooks/pre-commit.js .git/hooks/pre-commit
	cp githooks/commit-msg.js .git/hooks/commit-msg
	chmod +x .git/hooks/pre-commit
	chmod +x .git/hooks/commit-msg

clean: ## Clean
	rm -rf build
	cd ui && $(MAKE) clean
	cd py && $(MAKE) clean
	cd tools/wavegen && $(MAKE) clean
	rm -f waved

.PHONY: build
build: build-ui build-server ## Build everything

build-ui: ## Build UI
	cd ui && $(MAKE) build

build-ide: ## Build IDE
	cd ide && npm run build
	rm -rf ui/build/_ide
	mv ide/dist ui/build/_ide

build-wavegen: ## Build wavegen
	cd tools/wavegen && $(MAKE) build

run-ui: ## Run UI in development mode (hot reloading)
	cd ui && $(MAKE) run

test-ui-ci: ## Run UI unit tests in CI mode 
	cd ui && $(MAKE) test-ci

test-ui-watch: ## Run UI unit tests
	cd ui && $(MAKE) test

build-server: ## Build server for current OS/Arch
	go build $(LDFLAGS) -o waved cmd/wave/main.go

build-py: ## Build h2o_wave wheel
	cd py && $(MAKE) release

build-docker:
	docker build \
		--build-arg uid=$(shell id -u) \
		--build-arg gid=$(shell id -g) \
		-t wave-test:$(VERSION) \
		.

run: ## Run server
	go run cmd/wave/main.go -web-dir ./ui/build -debug

run-cypress: ## Run Cypress
	cd test && ./node_modules/.bin/cypress open

generate: ## Generate driver bindings
	cd tools/wavegen && $(MAKE) run

.PHONY: docs
docs: ## Generate API docs and copy to website
	cd py && $(MAKE) docs

publish-pypi: ## Publish PyPI package
	cd py && $(MAKE) publish

release: build-ui build-py ## Prepare release builds (e.g. "VERSION=v1.2.3 make release)"
	$(MAKE) OS=linux release-os
	$(MAKE) OS=darwin release-os
	$(MAKE) OS=windows EXE_EXT=".exe" release-os
	$(MAKE) build-website
	$(MAKE) publish-website

release-os:
	rm -rf build/$(REL)
	mkdir -p build/$(REL)
	rsync -a ui/build/ build/$(REL)/www
	rsync -a py/examples build/$(REL)/
	rm -rf test/cypress/integration/*.js
	rm -rf test/cypress/screenshots/*.*
	rm -rf test/cypress/videos/*.*
	rsync --exclude node_modules -a test build/$(REL)/
	GOOS=$(OS) GOARCH=amd64 go build $(LDFLAGS) -o build/$(REL)/waved$(EXE_EXT) cmd/wave/main.go
	cp readme.txt build/$(REL)/readme.txt
	cd build && tar -czf $(REL).tar.gz  --exclude='*.state'  --exclude='__pycache__' $(REL)

build-website: ## Build website
	cd website && npm run build

publish-website: ## Publish website
	rm -rf docs && mkdir docs && rsync -a website/build/ docs/

help: ## List all make tasks
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'
