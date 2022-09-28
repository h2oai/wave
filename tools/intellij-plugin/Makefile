SED=$(shell command -v gsed || command -v sed)

test:
	./gradlew test

build:
	./gradlew build

generate:
	./gradlew patchPluginXml

run:
	./gradlew runIde

verify:
	./gradlew runPluginVerifier

help:
	./gradlew -q :tasks --all

tag: # Bump version
	$(SED) -i -r -e 's/pluginVersion = .+/pluginVersion = $(VERSION)/' gradle.properties

publish:
	$(MAKE) clean
	$(MAKE) generate
	$(MAKE) test
	$(MAKE) verify
	$(MAKE) build
	./gradlew publishPlugin

clean:
	./gradlew clean