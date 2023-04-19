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
        q.page['hello'].counter.label = f'Current count: {q.client.count}'

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
