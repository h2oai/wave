# Tab
# Use tab cards to display #tabs on a page.
# ---
from h2o_wave import main, app, Q, ui


@app('/demo')
async def serve(q: Q):
    if '#' in q.args:
        hash_ = q.args['#']
        q.page['tabs'] = ui.form_card(box='1 1 2 5', items=[
            ui.text(f'#={hash_}'),
            ui.button(name='show_tabs', label='Back', primary=True),
        ])
    else:
        q.page['tabs'] = ui.tab_card(
            box='1 1 4 1',
            items=[
                ui.tab(name='#menu/spam', label='Spam'),
                ui.tab(name='#menu/ham', label='Ham'),
                ui.tab(name='#menu/eggs', label='Eggs'),
                ui.tab(name='#about', label='About'),
            ],
        )
    await q.page.save()
