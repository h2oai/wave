# Form / Combobox / Trigger
# To handle live changes to a #combobox, enable the `trigger` attribute.
# #combobox #trigger
# ---
from h2o_wave import main, app, Q, ui

combobox_choices = ['Cyan', 'Magenta', 'Yellow', 'Black']


def get_form_items(choice: str):
    return [
        ui.combobox(name='combobox', trigger=True, label='Enter or choose a color', placeholder='Color...', value='Blue',
                    choices=combobox_choices),
        ui.label('Sent to server'),
        ui.text(choice),
    ]


@app('/demo')
async def serve(q: Q):
    if not q.client.initialized:
        q.page['example'] = ui.form_card(box='1 1 4 10', items=get_form_items(''))
        q.client.initialized = True
    if q.args.combobox is not None:
        q.page['example'].items = get_form_items(q.args.combobox)
    await q.page.save()
