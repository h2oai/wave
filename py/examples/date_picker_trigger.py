# Form / Date Picker / Trigger
# To handle live changes to a date picker, enable the `trigger` attribute.
# #form #date_picker #trigger
# ---
from typing import Optional
from h2o_wave import main, app, Q, ui


def get_form_items(value: Optional[str]):
    return [
        ui.text(f'date_trigger={value}'),
        ui.date_picker(name='date_trigger', label='Pick a date', trigger=True),
    ]


@app('/demo')
async def serve(q: Q):
    if not q.client.initialized:
        q.page['example'] = ui.form_card(box='1 1 4 10', items=get_form_items(None))
        q.client.initialized = True
    else:
        q.page['example'].items = get_form_items(q.args.date_trigger)
    await q.page.save()
