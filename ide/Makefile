
ci: ## Install Node dependencies
	npm ci

setup: ci ## Install development dependencies

clean: ## Clean
	rm -rf dist node_modules

run: ## Launch server in development mode
	npm run start

.PHONY: build
build: ## Build front-end (production)
	npm run build

test: ## Run tests
	npm run test

test-ci: ## Run tests in CI mode
	npm run test:ci

help: ## List all make tasks
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'
		
