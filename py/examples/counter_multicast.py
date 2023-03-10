# Mode / Multicast
# Launch the server in #multicast #mode to synchronize browser state across a user's clients.
# Open `/demo` in multiple browsers and watch them synchronize in realtime.
# ---
from h2o_wave import main, app, Q, ui


@app('/demo', mode='multicast')
async def serve(q: Q):
    if not q.client.initialized:
        if q.user.count is None:
            q.user.count = 0

        q.page['example'] = ui.form_card(box='1 1 2 1', items=[
            ui.button(name='increment', label=f'Count={q.user.count}')
        ])
        q.client.initialized = True

    if q.args.increment:
        q.user.count += 1
        q.page['example'].increment.label = f'Count={q.user.count}'

    await q.page.save()
