# Form / Tabs
# No description available.
# ---
from telesync import Q, listen, ui

tabs = [
    ui.tab(name='eggs', label='Eggs', icon='Calendar'),
    ui.tab(name='spam', label='Spam'),
    ui.tab(name='ham', label='Ham'),
]


async def main(q: Q):
    if q.args.menu:
        q.page['example'].items = [
            ui.tabs(name='menu', value=q.args.menu, items=tabs),
        ]
    else:
        q.page['example'] = ui.form_card(box='1 1 4 10', items=[
            ui.tabs(name='menu', value='eggs', items=tabs),
        ])
    await q.page.push()


if __name__ == '__main__':
    listen('/demo', main)
