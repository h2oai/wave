# Mode / Unicast
# Launch the server in unicast mode and use `q.client` to manage client-local state.
# ---
from h2o_wave import Q, listen, ui, pack


async def serve(q: Q):
    count = q.client.count or 0
    if 'increment' in q.args:
        count += 1
        q.client.count = count

    items = pack([ui.button(name='increment', label=f'Count={count}')])

    if count > 0:
        form = q.page['example']
        form.items = items
    else:
        q.page['example'] = ui.form_card(box='1 1 12 10', items=items)

    await q.page.save()


listen('/demo', serve)
