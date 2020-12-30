# Nav
# Use nav cards to display #sidebar #navigation.
# ---
from h2o_wave import main, app, Q, ui


@app('/demo')
async def serve(q: Q):
    if '#' in q.args:
        hash_ = q.args['#']
        q.page['nav'] = ui.form_card(box='1 1 2 5', items=[
            ui.text(f'#={hash_}'),
            ui.button(name='show_nav', label='Back', primary=True),
        ])
    else:
        q.page['nav'] = ui.nav_card(
            box='1 1 2 5',
            value='#menu/spam',
            items=[
                ui.nav_group('Menu', items=[
                    ui.nav_item(name='#menu/spam', label='Spam'),
                    ui.nav_item(name='#menu/ham', label='Ham'),
                    ui.nav_item(name='#menu/eggs', label='Eggs'),
                    ui.nav_item(name='#menu/toast', label='Toast', disabled=True),
                ]),
                ui.nav_group('Help', items=[
                    ui.nav_item(name='#about', label='About', icon='Info'),
                    ui.nav_item(name='#support', label='Support', icon='Help'),
                ])
            ],
        )
    await q.page.save()
