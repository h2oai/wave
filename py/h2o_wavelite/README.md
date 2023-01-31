# H2O Wavelite

H2O Wavelite is a lighter version of [H2O Wave](https://wave.h2o.ai/), capable of seamless integration into popular existing python web frameworks like Django, Flask, FastAPI, Starlette etc.

The integration consists of 2 steps:

* Serve Wavelite's static web dir at the route of your choice.
* Set up a WebSocket connection and hook `wave_serve` callback function to control the UI.

Done. You can render UI elements with nothing but Python. Wavelite aims to be as simplistic as possible and only provides:

* A simple way to render your UI.
* A simple way of getting the UI inputs (like button clicks, dropdown values etc.)
* Minimal state management.

Nothing more, nothing less.

## Installation

----------

```bash
pip install "h2o-wavelite[web]"
```

Wavelite requires websockets to function properly. Not all libraries comes with them out of the box so you might need to install them additionally. For example Starlette requires:

```bash
pip install websockets
```

to be able to expose websocket handlers. This might differ from framework to framework.

## Using Wavelite within an existing page

Wavelite can also be used only for certain parts of your pages, e.g. for charts. In addition to the integration steps above:

* Use the `get_web_files` function which HTML links to scripts and styles for you to inject into your existing HTML.
* Render a `div` with an id `wave-root` (`<div id='wave-root'></div>`) into which you want Wavelite to render.

## Configuration

By default, Wavelite tries to connect to websocket route at `/_s/`. This can be configured by adding a `data-wave-socket-url` attribute on the HTML body element (`<body data-wave-socket-url='/my_socket_url/'>`).

## Links

* Website: [https://wave.h2o.ai/](https://wave.h2o.ai/)
* Releases: [https://pypi.org/project/h2o-wave/](https://pypi.org/project/h2o-wave/)
* Code: [https://github.com/h2oai/wave](https://github.com/h2oai/wave)
* Issue tracker: [https://github.com/h2oai/wave/issues](https://github.com/h2oai/wave/issues)
