# Form / Tabs
# Use tabs within a form to navigate between two or more distinct content categories.
# ---
from telesync import Q, listen, ui

tabs = [
    ui.tab(name='email', label='Mail', icon='Mail'),
    ui.tab(name='events', label='Events', icon='Calendar'),
    ui.tab(name='spam', label='Spam'),
]


async def main(q: Q):
    if q.args.menu:
        q.page['example'].items = [
            ui.tabs(name='menu', value=q.args.menu, items=tabs),
            get_tab_content(q.args.menu),
        ]
    else:
        q.page['example'] = ui.form_card(box='1 1 4 10', items=[
            ui.tabs(name='menu', value='email', items=tabs),
            get_tab_content('email'),
        ])
    await q.page.push()


def get_tab_content(category: str):
    # Return a checklist of dummy items.
    items = [f'{category.title()} {i}' for i in range(1, 11)]
    return ui.checklist(name='items', choices=[ui.choice(name=item, label=item) for item in items])


if __name__ == '__main__':
    listen('/demo', main)
