# Meta / Dialog / Disabled
# Control disabled state within displayed dialog.
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
        q.page['meta'].dialog = ui.dialog(name='dialog', title='Dialog Title', disabled=True, items=[
           ui.button(name='enable', label='Enable dialog')
        ])
    if q.args.enable:
        q.page['meta'].dialog.disabled = False
    if q.args.dialog:
        q.page['example'].items = [ui.text('Dialog submitted')]

    await q.page.save()
