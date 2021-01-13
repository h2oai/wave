PKG_VERSION=$(shell grep -i ^version DESCRIPTION | cut -d : -d \  -f 2)
PKG_NAME=$(shell grep -i ^package DESCRIPTION | cut -d : -d \  -f 2)

R_FILES := $(wildcard R/*.R)
SRC_FILES := $(wildcard R/*.R)
PKG_FILES := DESCRIPTION NAMESPACE $(R_FILES) $(SRC_FILES)

.PHONY: doc preinstall package install check clean 

all: clean preinstall doc package install

package: preinstall doc $(PKG_NAME)_$(PKG_VERSION).tar.gz
$(PKG_NAME)_$(PKG_VERSION).tar.gz: $(PKG_FILES)
	R CMD build .

package0: doc $(PKG_NAME)_$(PKG_VERSION).tar.gz
$(PKG_NAME)_$(PKG_VERSION).tar.gz: $(PKG_FILES)
	R CMD build .

check: $(PKG_NAME)_$(PKG_VERSION).tar.gz 
	R CMD check $(PKG_NAME)_$(PKG_VERSION).tar.gz

doc:
	Rscript -e '.libPaths(c("~/R_LIBS",.libPaths()));library(devtools);library(roxygen2);document()'

preinstall: 
	mkdir -p ~/R_LIBS
	R -e 'install.packages(c("roxygen2","devtools","httr","stringr"), repos="http://cran.us.r-project.org")'

install: 
	R CMD INSTALL $(PKG_NAME)_$(PKG_VERSION).tar.gz

uninstall: $(PKG_NAME)_$(PKG_VERSION).tar.gz
	R CMD REMOVE $(PKG_NAME)

.PHONY: tag
tag: # Bump version
	sed -i -r -e "s/Version.+/Version: $(VERSION)/" DESCRIPTION

uninstall: $(PKG_NAME)_$(PKG_VERSION).tar.gz
		R CMD REMOVE $(PKG_NAME)_$(PKG_VERSION).tar.gz

clean:
	-rm -f $(PKG_NAME)_*.tar.gz
	-rm -r -f $(PKG_NAME).Rcheck
	-rm -f NAMESPACE
	-rm -rf man

