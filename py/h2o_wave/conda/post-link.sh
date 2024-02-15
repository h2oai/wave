#!/bin/bash
# Moves waved with its dependencies to the python environment

PACKAGE_NAME=${PKG_NAME/-/_}

# Loop through all files/folders starting with "python" in the lib/$PREFIX directory
for item in $PREFIX/lib/python*; do
  # Check if it's a directory and "/site-packages/$PACKAGE_NAME-$PKG_VERSION.data" exists inside
    if [[ -d "$item" && -d "$item/site-packages/$PACKAGE_NAME-$PKG_VERSION.data" ]]; then
        # Move the folder content to the python environment
        mv -v $item/site-packages/$PACKAGE_NAME-$PKG_VERSION.data/* $PREFIX/
        # Remove data from old location.
        rm -rf $item/site-packages/$PACKAGE_NAME-$PKG_VERSION.data
        # Break the loop
        break
    fi
done