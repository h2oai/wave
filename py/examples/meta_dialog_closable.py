# Meta / Dialog / Closable
# Display a #dialog. #meta #closable
# ---
from h2o_wave import main, app, Q, ui


@app('/demo')
async def serve(q: Q):
    if not q.client.initialized:
        q.page['meta'] = ui.meta_card(box='')
        q.page['example'] = ui.form_card(box='1 1 2 1', items=[
            ui.button(name='show_dialog', label='Open dialog', primary=True)
        ])
        q.client.initialized = True
    if q.args.show_dialog:
        q.page['meta'].dialog = ui.dialog(title='Order Donuts', name='dialog', closable=True, items=[
            ui.text('This dialog can be only closed via X icon.'),
        ], events=['dismissed'])
    if q.events.dialog and q.events.dialog.dismissed:
        q.page['meta'].dialog = None

    await q.page.save()
