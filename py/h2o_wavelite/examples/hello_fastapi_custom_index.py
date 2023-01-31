import os

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from h2o_wavelite import Q, ui, wave_serve
from h2o_wavelite_web import get_web_files, web_directory
from jinja2 import Environment, FileSystemLoader

assets_path = '/custom/assets/path'
curr_dir = os.path.dirname(os.path.abspath(__file__))

# Prepare our custom index.html and inject required JS files. Jinja is used for convenience,
# you can use any templating engine.
template = Environment(loader=FileSystemLoader(curr_dir)).get_template("index_template.html")
# Inject JS files into the template. Accepts a path prefix if needed.
content = template.render(wave_files=get_web_files(assets_path))
with open(os.path.join(curr_dir, 'index.html'), mode="w", encoding="utf-8") as f:
    f.write(content)


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


# FastAPI boilerplate.
app = FastAPI()


# FastAPI: WebSocket must be registered before index.html handler.
@app.websocket("/custom_socket/")
async def ws(ws: WebSocket):
    try:
        await ws.accept()
        await wave_serve(serve, ws.send_text, ws.receive_text)
        await ws.close()
    except WebSocketDisconnect:
        print('Client disconnected')


@app.get("/")
async def get():
    return FileResponse(os.path.join(curr_dir, 'index.html'))

app.mount(assets_path, StaticFiles(directory=web_directory, html=True), name=assets_path)
