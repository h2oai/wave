#!/bin/bash

# Start the primary process and put it in the background
make run &
sleep 2
  
# Start the helper process
py/venv/bin/wave run examples.tour &
sleep 2

make test-ui-visual-ci