from h2o_wave import main, app, Q, ui, on, handle_on
from typing import Optional, List


class Pages:
    def __init__(self, excluded_keys: Optional[List[str]]):
        self.cards = dict()
        self.excluded_keys = excluded_keys or []

    def set_q(self, q: Q):
        self.q = q

    def add(self, key, card):
        self.cards[key] = card
        self.q.page[key] = card

    def delete(self, page):
        del self.cards[page]

    def drop(self):
        for key, page in self.cards.items():
            if key not in self.excluded_keys:
                del page
                del self.q.page[key]


pages = Pages(['sidebar', 'header', 'meta'])


@on('#link1')
async def link1(q: Q):
    q.page['body'].items = [ui.text('link1')]


@on('#link2')
async def link2(q: Q):
    q.page['body'].items = [ui.text('link2')]
    pages.drop()


@on('#link3')
async def link3(q: Q):
    q.page['body'].items = [ui.text('link3')]


@app('/demo')
async def serve(q: Q):
    if not q.client.initialized:
        pages.set_q(q)
        pages.add('meta', ui.meta_card(box='', layouts=[ui.layout(breakpoint='xs', zones=[
            ui.zone(name='main', size='100vh', direction=ui.ZoneDirection.ROW, zones=[
                ui.zone(name='sidebar', size='250px'),
                ui.zone(name='body', zones=[
                    ui.zone(name='header'),
                    ui.zone(name='content', size='1'),
                ]),
            ])
        ])]))

        pages.add('sidebar', ui.nav_card(
            box='sidebar', color='primary', title='My App', subtitle="Let's conquer the world!",
            image='https://www.h2o.ai/wp-content/themes/h2o2018/templates/dist/images/h2o_logo.svg', items=[
                ui.nav_group('Menu', items=[
                    ui.nav_item(name='#link1', label='Menu 1'),
                    ui.nav_item(name='#link2', label='Menu 2'),
                    ui.nav_item(name='#link3', label='Menu 3'),
                ]),
            ]))
        pages.add('header', ui.header_card(box='header', title='', subtitle='', items=[
            ui.textbox(name='search', icon='Search', width='300px', placeholder='Search...'),
        ]))
        q.page['body'] = ui.form_card(box='content', items=[ui.text(content='Content')])
        q.client.initialized = True

    await handle_on(q)
    await q.page.save()
