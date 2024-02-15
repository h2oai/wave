#!/bin/bash
# Removes folders "project_templates", "www" and file "waved" from the python environment on uninstall

PACKAGE_NAME=${PKG_NAME/-/_}

rm -rf $PREFIX/project_templates
rm -rf $PREFIX/www
rm -f $PREFIX/waved


