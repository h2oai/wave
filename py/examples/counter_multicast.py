# Mode / Multicast
# Launch the server in multicast mode to synchronize browser state across a user's clients.
# ---
from telesync import Q, listen, ui, pack


async def main(q: Q):
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


if __name__ == '__main__':
    listen('/demo', main, mode='multicast')
