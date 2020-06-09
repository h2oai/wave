from telesync import Q, listen, ui, pack

count = 0


async def main(q: Q):
    global count
    if 'increment' in q.args:
        count += 1

    items = pack([ui.button(name='increment', label=f'Count={count}')])

    if count > 0:
        form = q.page['a_form']
        form.items = items
    else:
        q.page['a_form'] = ui.form_card(box='1 1 12 10', items=items)

    await q.page.push()


if __name__ == '__main__':
    listen('/test_app', main)
