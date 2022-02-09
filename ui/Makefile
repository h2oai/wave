
ci: ## Install Node dependencies
	npm ci

setup: ci ## Install development dependencies

clean: ## Clean
	rm -rf build node_modules

run: ## Launch server in development mode
	npm start

.PHONY: build
build: ## Build front-end (production)
	rm -rf build
	mkdir build
	cp -r public/ build
	npm run build

test: ## Run tests
	npm test

test-ci: ## Run tests in CI mode
	npm run test:ci

help: ## List all make tasks
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'
		
