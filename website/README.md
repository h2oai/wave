# Website

This website is built using [Docusaurus 2](https://v2.docusaurus.io/), a modern static website generator.

## Installation

```console
git clone https://github.com/h2oai/wave.git
cd wave/py
make setup
make docs
cd ../tools/showcase
make setup
make generate
cd ../../website
make ci
```

## Local Development

```console
npm start
```

This command starts a local development server and open up a browser window. Most changes are reflected live without having to restart the server.

## Build

```console
npm run build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

## Serve


```console
npm run serve
```

Serve your built site locally. Use only after running `npm run build`.

