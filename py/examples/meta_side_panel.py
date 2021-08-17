# Meta / SidePanel
# Display a #sidePanel. #meta
# ---
from h2o_wave import main, app, Q, ui


@app('/demo')
async def serve(q: Q):
    if not q.client.initialized:
        q.page['meta'] = ui.meta_card(box='')
        q.page['example'] = ui.form_card(box='1 1 11 10', items=[
            ui.button(name='show_side_panel', label='Order donuts', primary=True)
        ])
        q.client.initialized = True
    else:
        if q.args.show_side_panel:
            q.page['meta'].side_panel = ui.side_panel(title='Welcome to store', items=[
                ui.text('Donuts cost $1.99. Proceed?'),
                ui.buttons([ui.button(name='next_step', label='Next', primary=True)])
            ])
        elif q.args.next_step:
            q.page['meta'].side_panel.items = [
                ui.text('You will be charged $1.99. Proceed?'),
                ui.buttons([
                    ui.button(name='cancel', label='Back to safety'),
                    ui.button(name='submit', label='Place order', primary=True),
                ])
            ]
        elif q.args.submit:
            q.page['example'].items = [ui.message_bar('success', 'Order placed!')]
            q.page['meta'].side_panel = None

        elif q.args.cancel:
            q.page['example'].items = [ui.message_bar('info', 'Order canceled!')]
            q.page['meta'].side_panel = None

    await q.page.save()
