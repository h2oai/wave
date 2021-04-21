PKG_VERSION=$(shell grep -i ^version DESCRIPTION | cut -d : -d \  -f 2)
PKG_NAME=$(shell grep -i ^package DESCRIPTION | cut -d : -d \  -f 2)

R_FILES := $(wildcard R/*.R)
SRC_FILES := $(wildcard R/*.R)
PKG_FILES := DESCRIPTION NAMESPACE $(R_FILES) $(SRC_FILES)

.PHONY: doc preinstall package install check clean 

all: clean doc package check install

package: doc $(PKG_NAME)_$(PKG_VERSION).tar.gz
$(PKG_NAME)_$(PKG_VERSION).tar.gz: $(PKG_FILES)
	R CMD build .

check: $(PKG_NAME)_$(PKG_VERSION).tar.gz 
		R CMD check $(PKG_NAME)_$(PKG_VERSION).tar.gz

doc:
		Rscript -e "library(devtools);library(roxygen2);document()"

preinstall:
		Rscript R/requirements.R

install: preinstall $(PKG_NAME)_$(PKG_VERSION).tar.gz
		R CMD INSTALL $(PKG_NAME)_$(PKG_VERSION).tar.gz

uninstall: $(PKG_NAME)_$(PKG_VERSION).tar.gz
		R CMD REMOVE $(PKG_NAME)_$(PKG_VERSION).tar.gz

clean:
		-rm -f $(PKG_NAME)_*.tar.gz
		-rm -r -f $(PKG_NAME).Rcheck
		-rm -f NAMESPACE
		-rm -rf man

