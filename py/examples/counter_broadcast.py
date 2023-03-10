# Mode / Broadcast
# Launch the server in #broadcast #mode to synchronize browser state across users.
# Open `/demo` in multiple browsers and watch them synchronize in realtime.
# ---
from h2o_wave import main, app, Q, ui


@app('/demo', mode='broadcast')
async def serve(q: Q):
    if not q.client.initialized:
        if q.app.count is None:
            q.app.count = 0

        q.page['example'] = ui.form_card(box='1 1 2 1', items=[
            ui.button(name='increment', label=f'Count={q.app.count}')
        ])
        q.client.initialized = True

    if q.args.increment:
        q.app.count += 1
        q.page['example'].increment.label = f'Count={q.app.count}'

    await q.page.save()
