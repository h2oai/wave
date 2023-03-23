OS?=linux
VERSION ?= $(shell cat VERSION)
ARCH?=amd64
BUILD_DATE?=$(shell date '+%Y%m%d%H%M%S')
REL=wave-$(VERSION)-$(OS)-$(ARCH)
LDFLAGS := -ldflags '-X main.Version=$(VERSION) -X main.BuildDate=$(BUILD_DATE)'
# HACK: Linux uses GNU sed, while OSX uses BSD - need to install gsed to unify.
SED=$(shell command -v gsed || command -v sed)

all: clean setup build ## Setup and build everything

setup: ## Set up development dependencies
	$(MAKE) setup-ui
	$(MAKE) setup-vsc
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
	cd ts && npm ci && npm run build-dev
	cd ts && npm link
	cd ui && npm link h2o-wave

setup-ui:
	cd ui && $(MAKE) setup

setup-py-tests:
	cd py && $(MAKE) setup-tests

setup-vsc:
	cd tools/vscode-extension && $(MAKE) setup

setup-e2e:
	cd e2e && $(MAKE) setup

.PHONY: build
build: build-ui build-server ## Build everything

build-ui: ## Build UI
	cd ui && $(MAKE) build

build-ide: ## Build IDE
	cd ide && npm run build
	rm -rf ui/build/_ide
	mv ide/dist ui/build/_ide

build-r: ## Build R client.
	cd r && $(MAKE) build

build-r-nightly: ## Build nightly R client.
	cd r && $(MAKE) build-nightly

build-apps: ## Prepare apps for HAC upload.
	mkdir -p py/tmp
	for app in py/apps/*; do mkdir -p build/apps/wave-`basename $$app`; done
	cp -r py/apps/* py/tmp/
	find py/tmp -type f -name '*.toml' -exec $(SED) -i -e "s/{{VERSION}}/$(VERSION)/g" {} \;
	find py/tmp -type f -name 'requirements.txt' -exec $(SED) -i -e "s/{{VERSION}}/$(VERSION)/g" {} \;
	rsync -a py/examples py/tmp/tour --exclude "*.idea*" --exclude "*__pycache__*" --exclude "*.mypy_cache*" --exclude "dist" --exclude "build"
	rsync -a py/demo py/tmp/dashboard --exclude "*.idea*" --exclude "*__pycache__*" --exclude "*.mypy_cache*" --exclude "dist" --exclude "build"
	cp py/examples/theme_generator.py py/tmp/theme-generator
	cp tools/vscode-extension/base-snippets.json py/tmp/tour/examples
	cp tools/vscode-extension/component-snippets.json py/tmp/tour/examples
	cp tools/vscode-extension/server/utils.py py/tmp/tour/examples/tour_autocomplete_utils.py
	cp tools/vscode-extension/server/parser.py py/tmp/tour/examples/tour_autocomplete_parser.py
	$(SED) -i -r -e "s#^@app\(('|\")(.*)('|\")(.*)#@app\('/'\4#" py/tmp/tour/examples/tour.py 
	$(SED) -i -r -e "s#^@app\(('|\")(.*)('|\")(.*)#@app\('/'\4#" py/tmp/theme-generator/theme_generator.py 
	for app in py/tmp/*; do cd $$app && zip -r ../../../build/apps/wave-`basename $$app`/`basename $$app`-$(VERSION).wave * && cd -; done
	rm -rf py/tmp
	cd studio && $(MAKE) build
	cd university && $(MAKE) build

generator: ## Build driver generator
	cd tools/wavegen && $(MAKE) build

run-ui: ## Run UI in development mode (hot reloading)
	cd ui && $(MAKE) run

test-ui-ci: ## Run UI unit tests in CI mode
	cd ui && $(MAKE) test-ci

test-py-ci: ## Run Python unit tests in CI mode
	cd py && $(MAKE) test

test-vsc-ci: ## Run Python unit tests in CI mode
	cd tools/vscode-extension && $(MAKE) test

test-intellij-ci:
	cd tools/intellij-plugin && $(MAKE) test

test-e2e-ci:
	cd e2e && $(MAKE) test

test-e2e-macos-ci:
	cd e2e && $(MAKE) test-macos

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

build-py: ## Build h2o_wave, h2o_lightwave and h2o_lightwave_web wheel.
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

release: build-ui ## Prepare release builds (e.g. "VERSION=1.2.3 make release)"
	$(MAKE) OS=linux ARCH=amd64 release-os
	$(MAKE) OS=darwin ARCH=amd64 release-os
	$(MAKE) OS=darwin ARCH=arm64 release-os
	$(MAKE) OS=windows ARCH=amd64 EXE_EXT=".exe" release-os
	$(MAKE) website
	$(MAKE) build-py
	$(MAKE) build-r

release-nightly: build-ui ## Prepare nightly release builds. 
	$(MAKE) OS=linux ARCH=amd64 release-os
	$(MAKE) OS=darwin ARCH=amd64 release-os
	$(MAKE) OS=darwin ARCH=arm64 release-os
	$(MAKE) OS=windows ARCH=amd64 EXE_EXT=".exe" release-os
	cd py && $(MAKE) build-wave
	$(MAKE) build-r-nightly

publish-release-s3:
	aws s3 sync build/ s3://h2o-wave/releases --acl public-read --exclude "*" --include "*.tar.gz"
	aws s3 sync py/h2o_wave/dist/ s3://h2o-wave/releases --acl public-read --exclude "*" --include "*.whl"
	aws s3 sync r/build/ s3://h2o-wave/releases --acl public-read --exclude "*" --include "*.tar.gz"

publish-apps-s3-mc:
	aws s3 sync build/apps/wave-dashboard $(MC_S3_BUCKET)/wave-dashboard
	aws s3 sync build/apps/wave-tour $(MC_S3_BUCKET)/wave-tour
	aws s3 sync build/apps/wave-theme-generator $(MC_S3_BUCKET)/wave-theme-generator

publish-apps-s3-hac:
	for app in build/apps/*; do aws s3 sync $$app $(HAC_S3_BUCKET)/`basename $$app`; done

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
	GOOS=$(OS) GOARCH=$(ARCH) go build $(LDFLAGS) -o build/$(REL)/waved$(EXE_EXT) cmd/wave/main.go
	cp readme.txt build/$(REL)/readme.txt
	cd build && tar -czf $(REL).tar.gz  --exclude='*.state'  --exclude='__pycache__' $(REL)

.PHONY: website
website: pydocs ## Build website
	cd website && npm ci && npm run build

preview-website: ## Preview website
	go run cmd/fs/main.go -web-dir website/build

publish-website: ## Publish website
	aws s3 sync website/build s3://wave.h2o.ai --delete

publish-pycharm: ## Publish PyCharm plugin
	cd tools/intellij-plugin && $(MAKE) publish
	
publish-vsc-extension: ## Publish VS Code extension
	cd tools/vscode-extension && $(MAKE) publish

publish-university:
	cd university && $(MAKE) publish
	
publish-lightwave:
	cd ui && npm ci && npm run build
	cd py && $(MAKE) setup
	cd py && $(MAKE) build-lightwave
	cd py && $(MAKE) build-lightwave-web
	
.PHONY: tag
tag: ## Bump version and tag
	cd py && $(MAKE) tag
	cd r && $(MAKE) tag
	cd tools/vscode-extension && $(MAKE) tag
	cd tools/intellij-plugin && $(MAKE) tag
	git add .
	git commit -m "chore: Release v$(VERSION)"
	git tag v$(VERSION)
	git push origin && git push origin --tags

help: ## List all make tasks
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'
