from telesync import Q, serve, ui, pack

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
        q.page['a_form'] = ui.form(url=q.url, box='1 1 12 10', items=items)

    await q.page.push()


if __name__ == '__main__':
    serve(handle=main, app_url='/test_app')
