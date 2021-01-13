# Mode / Unicast
# Launch the server in #unicast #mode and use `q.client` to manage client-local state.
# ---
from h2o_wave import main, app, Q, ui


@app('/demo')
async def serve(q: Q):
    count = q.client.count or 0

    if not q.client.initialized:
        q.page['example'] = ui.form_card(box='1 1 -1 -1', items=[
            ui.button(name='increment', label=f'Count={count}')
        ])
        q.client.initialized = True

    if q.args.increment:
        q.client.count = count = count + 1
        q.page['example'].items[0].button.label = f'Count={count}'

    await q.page.save()
