# Nav / Value
# Use this kind of Nav then you want to have control over currently active nav items.
# ---
from h2o_wave import main, app, Q, ui


@app('/demo')
async def serve(q: Q):
    if not q.client.initialized:
        q.page['form'] = ui.form_card(box='3 1 2 5', items=[
            ui.button(name='deselect', label='Deselect All'),
            ui.button(name='spam', label='Select spam'),
            ui.button(name='ham', label='Select ham'),
            ui.button(name='eggs', label='Select eggs'),
        ])
        q.page['nav'] = ui.nav_card(
            box='1 1 2 5',
            value='#menu/spam',
            items=[
                ui.nav_group('Menu', items=[
                    ui.nav_item(name='#menu/spam', label='Spam'),
                    ui.nav_item(name='#menu/ham', label='Ham'),
                    ui.nav_item(name='#menu/eggs', label='Eggs'),
                ])
            ],
        )
        q.client.initialized = True

    if q.args.deselect:
        q.page['nav'].value = ''
    elif q.args.spam:
        q.page['nav'].value = '#menu/spam'
    elif q.args.ham:
        q.page['nav'].value = '#menu/ham'
    elif q.args.eggs:
        q.page['nav'].value = '#menu/eggs'

    await q.page.save()
