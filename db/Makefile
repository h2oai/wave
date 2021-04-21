ifneq ($(origin VERSION), undefined)
	LDFLAGS := -ldflags '-X github.com/h2oai/wave/surf/build.Date=$(BUILD_DATE) -X github.com/h2oai/wave/surf/build.Version=$(VERSION) -X github.com/h2oai/wave/surf/build.ID=$(BUILD_ID)'
endif

all: clean build ## Setup and build everything

clean: ## Clean
	rm -f surf

build: ## Build database for current OS/Arch
	CGO_ENABLED=1 go build $(LDFLAGS) -o surf cmd/surf/main.go

run: ## Run database
	go run cmd/surf/main.go

help: ## List all make tasks
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'
