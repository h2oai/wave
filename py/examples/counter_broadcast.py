# Mode / Broadcast
# Launch the server in broadcast mode to synchronize browser state across users.
# Open `/demo` in multiple browsers and watch them synchronize in realtime.
# ---
from h2o_q import Q, listen, ui, pack


async def serve(q: Q):
    count = q.app.count or 0
    if 'increment' in q.args:
        count += 1
        q.app.count = count

    items = pack([ui.button(name='increment', label=f'Count={count}')])

    if count > 0:
        form = q.page['example']
        form.items = items
    else:
        q.page['example'] = ui.form_card(box='1 1 12 10', items=items)

    await q.page.save()


listen('/demo', serve, mode='broadcast')
