---
title: Lightwave
---

H2O Lightwave is a lightweight, pure-Python version of [H2O Wave](https://wave.h2o.ai/) that can be embedded in popular async web frameworks like [FastAPI](https://fastapi.tiangolo.com/), [Starlette](https://www.starlette.io/), etc.

In other words, H2O Lightwave works without the Wave server. Lightwave aims to be as minimal as possible and only provides:

* A simple way to render your UI.
* A simple way of capturing the user interactions (like button clicks, dropdown values etc.).
* Minimal state management.

Nothing more, nothing less.

## Installation

```bash
pip install "h2o-lightwave[web]"
```

Lightwave requires websockets to function properly. Not all libraries come with them out of the box so you might need to install them additionally. For example, Starlette & FastAPI requires

```bash
pip install websockets
```

to be able to expose websocket handlers. This might differ from framework to framework.

## Integration

The integration consists of 2 steps:

* Add Wave's web assets directory to your framework's static file handler.
* Add a webSocket handler, and use `wave_serve()` to connect Wave to your web UI.

That's it. You can now render UI elements using pure Python.

## FastAPI integration

```py
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.staticfiles import StaticFiles
from h2o_lightwave import Q, ui, wave_serve
from h2o_lightwave_web import web_directory


# Lightwave callback function.
async def serve(q: Q):
    # Paint our UI on the first page visit.
    if not q.client.initialized:
        # Create a local state.
        q.client.count = 0
        # Add a "card" with a text and a button
        q.page['hello'] = ui.form_card(box='1 1 2 2', items=[
            ui.text_xl('Hello world'),
            ui.button(name='counter', label=f'Current count: {q.client.count}'),
        ])
        q.client.initialized = True

    # Handle counter button click.
    if q.args.counter:
        # Increment the counter.
        q.client.count += 1
        # Update the counter button.
        q.page['hello'].items[1].button.label = f'Current count: {q.client.count}'

    # Send the UI changes to the browser.
    await q.page.save()


# Run: uvicorn hello_fastapi:app.
# FastAPI boilerplate.
app = FastAPI()


# FastAPI: WebSocket must be registered before index.html handler.
@app.websocket("/_s/")
async def ws(ws: WebSocket):
    try:
        await ws.accept()
        await wave_serve(serve, ws.send_text, ws.receive_text)
        await ws.close()
    except WebSocketDisconnect:
        print('Client disconnected')

app.mount("/", StaticFiles(directory=web_directory, html=True), name="/")
```

We also recommend reading the [blog post](https://medium.com/@unusualcode/h2o-lightwave-building-web-uis-with-fastapi-and-python-88a915383490) and other [integration examples](https://github.com/h2oai/wave/tree/main/py/h2o_lightwave/examples).

## Widgets

See [all the available widgets](https://wave.h2o.ai/docs/widgets/overview) to use.

## Custom HTML page

Lightwave can also be used only for certain parts of your HTML pages, e.g. for charts. In addition to the integration steps above:

* Use the `get_web_files` function which HTML links to scripts and styles for you to inject into your existing HTML.
* Render a `div` with an id `wave-root` (`<div id='wave-root'></div>`) into which you want Lightwave to render.
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

### Configuration

By default, Lightwave tries to connect to websocket route at `/_s/`. This can be configured by adding a `data-wave-socket-url` attribute on the HTML body element (`<body data-wave-socket-url='/my_socket_url/'>`).
