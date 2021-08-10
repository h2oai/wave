# Form / Spinbox / Trigger
# Enable the `trigger` attribute in order to handle live changes to a spinbox.
# #form #spinbox #trigger
# ---
from typing import Optional
from h2o_wave import main, app, Q, ui


def get_form_items(value: Optional[float]):
    return [
        ui.text(f'spinbox_trigger={value}'),
        ui.spinbox(name='spinbox_trigger', label='Pick a number', trigger=True),
    ]


@app('/demo')
async def serve(q: Q):
    if not q.client.initialized:
        q.page['example'] = ui.form_card(box='1 1 4 4', items=get_form_items(None))
        q.client.initialized = True
    if q.args.spinbox_trigger is not None:
        q.page['example'].items = get_form_items(q.args.spinbox_trigger)

    await q.page.save()
