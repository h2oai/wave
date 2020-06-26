ifneq ($(origin VERSION), undefined)
	LDFLAGS := -ldflags '-X github.com/h2oai/telesync/teledb/build.Date=$(BUILD_DATE) -X github.com/h2oai/telesync/teledb/build.Version=$(VERSION) -X github.com/h2oai/telesync/teledb/build.ID=$(BUILD_ID)'
endif

all: clean build ## Setup and build everything

clean: ## Clean
	rm -f teledb

build: ## Build database for current OS/Arch
	CGO_ENABLED=1 go build $(LDFLAGS) -o teledb cmd/teledb/main.go

run: ## Run database
	go run cmd/teledb/main.go

help: ## List all make tasks
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'
