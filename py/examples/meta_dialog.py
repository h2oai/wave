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
        q.page['meta'].dialog = ui.dialog(name='dialog', title='Dialog Title', items=[ui.text('Dialog content')])
    if q.args.dialog:
        q.page['example'].items = [ui.text('Dialog submitted')]

    await q.page.save()
