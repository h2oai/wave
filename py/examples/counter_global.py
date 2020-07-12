# Mode / Broadcast / Global
# Launch the server in broadcast mode to synchronize browser state across users. Global variables can be used to manage state.
# ---
from telesync import Q, listen, ui, pack

count = 0


async def main(q: Q):
    global count
    if 'increment' in q.args:
        count += 1

    items = pack([ui.button(name='increment', label=f'Count={count}')])

    if count > 0:
        form = q.page['example']
        form.items = items
    else:
        q.page['example'] = ui.form_card(box='1 1 12 10', items=items)

    await q.page.push()


if __name__ == '__main__':
    listen('/demo', main, mode='broadcast')
