# Wavegen

Wavegen code-generates language-specific counterparts of front-end cards/components for use in language-specfic drivers. Uses the Typescript compiler API.

To use the generator, run `make generate` using the root `Makefile`.

If you make changes to the generator, you'll need to compile it to update the drivers.

Steps: 
1. Run `make setup` to set up development dependencies (one-time).
2. Run `make build` to build the generator (every time you make changes to the generator).
3. Run `make run` to run the generator (every time you make changes to the UI). Same as calling `make generate` from the root `Makefile`.