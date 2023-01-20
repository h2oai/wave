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

## Starlette Hello world

```py
import uvicorn
from starlette.applications import Starlette
from starlette.routing import Mount, WebSocketRoute
from starlette.staticfiles import StaticFiles
from starlette.websockets import WebSocketDisconnect
from h2o_wavelite import wave_serve, ui, Q
from h2o_wavelite_web import web_directory


# Wavelite callback function.
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


# Starlette boilerplate.
async def socket(ws):
    try:
        await ws.accept()
        await wave_serve(serve, ws.send_text, ws.receive_text)
        await ws.close()
    except WebSocketDisconnect:
        print('Client disconnected')


startlette_app = Starlette(routes=[
    # Register a websocket.
    WebSocketRoute('/_s/', socket),
    # Serve static assets.
    Mount("/", app=StaticFiles(directory=web_directory, html=True), name="/")
])

if __name__ == '__main__':
    uvicorn.run(startlette_app, host='0.0.0.0', port=5000)

```

## Links

* Website: [https://wave.h2o.ai/](https://wave.h2o.ai/)
* Releases: [https://pypi.org/project/h2o-wave/](https://pypi.org/project/h2o-wave/)
* Code: [https://github.com/h2oai/wave](https://github.com/h2oai/wave)
* Issue tracker: [https://github.com/h2oai/wave/issues](https://github.com/h2oai/wave/issues)
