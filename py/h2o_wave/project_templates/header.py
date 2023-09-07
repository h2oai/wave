from h2o_wave import main, app, Q, ui, on, run_on


@app('/')
async def serve(q: Q):
    # First time a browser comes to the app
    if not q.client.initialized:
        await init(q)
        q.client.initialized = True

    # Other browser interactions
    await run_on(q)
    await q.page.save()


async def init(q: Q) -> None:
    q.client.cards = set()
    q.client.dark_mode = False

    q.page['meta'] = ui.meta_card(
        box='',
        title='My Wave App',
        theme='light',
        layouts=[
            ui.layout(
                breakpoint='xs',
                min_height='100vh',
                max_width='1200px',
                zones=[
                    ui.zone('header'),
                    ui.zone('content', size='1', zones=[
                        ui.zone('horizontal', direction=ui.ZoneDirection.ROW),
                        ui.zone('vertical', size='1', ),
                        ui.zone('grid', direction=ui.ZoneDirection.ROW, wrap='stretch', justify='center')
                    ]),
                    ui.zone(name='footer'),
                ]
            )
        ]
    )
    q.page['header'] = ui.header_card(
        box='header',
        title='My Wave App',
        subtitle="Example to get us started",
        image='https://wave.h2o.ai/img/h2o-logo.svg',
        items=[ui.menu(icon='', items=[ui.command(name='change_theme', icon='ClearNight', label='Dark Mode')])]
    )
    q.page['footer'] = ui.footer_card(
        box='footer',
        caption='Made with 💛 using [H2O Wave](https://wave.h2o.ai).'
    )

    await home(q)


@on()
async def home(q: Q):
    clear_cards(q)
    add_card(q, 'form', ui.form_card(box='vertical', items=[ui.text('This is my app!')]))


@on()
async def change_theme(q: Q):
    """Change the app from light to dark mode"""
    if q.client.dark_mode:
        q.page["header"].items = [ui.menu([ui.command(name='change_theme', icon='ClearNight', label='Dark mode')])]
        q.page["meta"].theme = "light"
        q.client.dark_mode = False
    else:
        q.page["header"].items = [ui.menu([ui.command(name='change_theme', icon='Sunny', label='Light mode')])]
        q.page["meta"].theme = "h2o-dark"
        q.client.dark_mode = True


# Use for cards that should be deleted on calling `clear_cards`. Useful for routing and page updates.
def add_card(q, name, card) -> None:
    q.client.cards.add(name)
    q.page[name] = card


def clear_cards(q, ignore=[]) -> None:
    for name in q.client.cards.copy():
        if name not in ignore:
            del q.page[name]
            q.client.cards.remove(name)
