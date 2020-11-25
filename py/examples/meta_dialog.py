# Meta / Dialog
# Display a dialog.
# ---
from h2o_wave import main, app, Q, ui


@app('/demo')
async def serve(q: Q):
    if not q.client.initialized:
        q.page['meta'] = ui.meta_card(box='')
        q.page['example'] = ui.form_card(box='1 1 -1 -1', items=[
            ui.button(name='show_dialog', label='Show dialog')
        ])
        q.client.initialized = True
    if q.args.show_dialog:
        q.page['meta'].dialog = ui.dialog(title='Dialog Title', items=[
            ui.text('Dialog content'),
            ui.buttons([ui.button(name='next', label='Next', primary=True)])
        ])
    if q.args.next:
        q.page['meta'].dialog.items = [
            ui.text('Final step'),
            ui.buttons([
                ui.button(name='cancel', label='Cancel'),
                ui.button(name='submit', label='Submit', primary=True),
            ])
        ]

    if q.args.submit:
        q.page['example'].items = [ui.text('Dialog submitted')]

    if q.args.cancel or q.args.submit:
        q.page['meta'].dialog = None

    await q.page.save()
