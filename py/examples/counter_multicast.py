# Mode / Multicast
# Launch the server in #multicast #mode to synchronize browser state across a user's clients.
# Open `/demo` in multiple browsers and watch them synchronize in realtime.
# ---
from h2o_wave import main, app, Q, ui, pack


@app('/demo', mode='multicast')
async def serve(q: Q):
    count = q.user.count or 0
    if 'increment' in q.args:
        count += 1
        q.user.count = count

    items = pack([ui.button(name='increment', label=f'Count={count}')])

    if count > 0:
        form = q.page['example']
        form.items = items
    else:
        q.page['example'] = ui.form_card(box='1 1 12 10', items=items)

    await q.page.save()
