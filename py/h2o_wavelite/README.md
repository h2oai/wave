# H2O Wavelite

H2O Wavelite is a lighter version of [H2O Wave](https://wave.h2o.ai/) consisting of python driver only, no Golang server. This allows for seamless integration into popular existing python web frameworks like Django, Flask, FastAPI, Starlette etc.

The integration consists of 2 steps:

* Serve Wavelite's static web dir at the route of your choice.
* Set up a WebSocket connection and hook `wave_serve` callback function to control the UI.

Done. You can render UI elements with nothing but Python. Wavelite aims to be as simplistic as possible and only provides:

* A simple way to render your UI.
* A simple way of getting the UI inputs (like button clicks, dropdown values etc.)
* Minimal state management.

Nothing more, nothing less.

## Installation

```bash
pip install "h2o-wavelite[web]"
```

Wavelite requires websockets to function properly. Not all libraries come with them out of the box so you might need to install them additionally. For example, Starlette & FastAPI requires

```bash
pip install websockets
```

to be able to expose websocket handlers. This might differ from framework to framework.

## Widgets

All available widgets can be found [here](https://wave.h2o.ai/docs/widgets/overview). We are working on separate docs for Wavelite.

## Using Wavelite within an existing HTML page

Wavelite can also be used only for certain parts of your HTML pages, e.g. for charts. In addition to the integration steps above:

* Use the `get_web_files` function which HTML links to scripts and styles for you to inject into your existing HTML.
* Render a `div` with an id `wave-root` (`<div id='wave-root'></div>`) into which you want Wavelite to render.
* Render a parent container for `wave-root` that has `position: relative` and has some dimensions attached.

```html
{# index_template.html #}
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <!-- Scripts and stylesheets required for Wave to work properly. -->
  {{ wave_files }}
</head>
<style>
  /* Must have position: relative and some size specified (e.g. height, flexbox, absolute positioning etc.). */
  .wave-container {
    position: relative;
    height: 800px;
  }
</style>

<!-- Websocket URL can be changed if needed. Defaults to "/_s/". -->
<body data-wave-socket-url="/custom_socket/">
  <noscript>You need to enable JavaScript to run this app.</noscript>
  <div class="wave-container">
    <!-- Wave renders here. -->
    <div id="wave-root"></div>
  </div>
</body>

</html>
```

## Configuration

By default, Wavelite tries to connect to websocket route at `/_s/`. This can be configured by adding a `data-wave-socket-url` attribute on the HTML body element (`<body data-wave-socket-url='/my_socket_url/'>`).

## Links

* Website: [https://wave.h2o.ai/](https://wave.h2o.ai/)
* Releases: [https://pypi.org/project/h2o-wave/](https://pypi.org/project/h2o-wave/)
* Code: [https://github.com/h2oai/wave](https://github.com/h2oai/wave)
* Issue tracker: [https://github.com/h2oai/wave/issues](https://github.com/h2oai/wave/issues)
