# HTTP / Client
# Use any http client to communicate with RESTful APIs.
# #http
# ---
from h2o_wave import main, app, Q, ui
import httpx


@app('/demo')
async def serve(q: Q):
    if not q.client.initialized:
        q.page['form'] = ui.form_card(box='1 1 4 6', items=[
            ui.buttons([
                ui.button(name='clear', label='Clear'),
                ui.button(name='download', label='Download', primary=True)
            ]),
            ui.text_m('No data yet.'),
        ])
        q.client.initialized = True
    if q.args.download:
        response = httpx.get('https://jsonplaceholder.typicode.com/posts/1')
        q.page['form'].items[1].text_m.content = response.text
    if q.args.clear:
        q.page['form'].items[1].text_m.content = 'No data yet.'

    await q.page.save()
