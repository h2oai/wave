# Mode / Broadcast / Global
# Launch the server in #broadcast #mode to synchronize browser state across users.
# Global variables can be used to manage state.
# Open `/demo` in multiple browsers and watch them synchronize in realtime.
# ---
from h2o_wave import main, app, Q, ui, pack

count = 0


@app('/demo', mode='broadcast')
async def serve(q: Q):
    global count
    if 'increment' in q.args:
        count += 1

    items = pack([ui.button(name='increment', label=f'Count={count}')])

    if count > 0:
        form = q.page['example']
        form.items = items
    else:
        q.page['example'] = ui.form_card(box='1 1 12 10', items=items)

    await q.page.save()
