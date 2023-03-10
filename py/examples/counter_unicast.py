# Mode / Unicast
# Launch the server in #unicast #mode and use `q.client` to manage client-local state.
# ---
from h2o_wave import main, app, Q, ui


@app('/demo')
async def serve(q: Q):
    if not q.client.initialized:
        q.client.count = 0
        q.page['example'] = ui.form_card(box='1 1 2 1', items=[
            ui.button(name='increment', label=f'Count={q.client.count}')
        ])
        q.client.initialized = True

    if q.args.increment:
        q.client.count += 1
        q.page['example'].increment.label = f'Count={q.client.count}'

    await q.page.save()
