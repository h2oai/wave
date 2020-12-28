# Form / Date Picker / Trigger
# To handle live changes to a date picker, enable the `trigger` attribute.
# #form #date_picker #trigger
# ---
from h2o_wave import main, app, Q, ui


@app('/demo')
async def serve(q: Q):
    if not q.client.initialized:
        q.page['example'] = ui.form_card(box='1 1 4 10', items=[
            ui.text(f'date_trigger={q.args.date_trigger}'),
            ui.date_picker(name='date_trigger', label='Pick a date', trigger=True),
        ])
        q.client.initialized = True
    else:
        q.page['example'].items[0].text.content = f'Selected date: {q.args.date_trigger}'
        q.page['example'].items[1].date_picker.value = q.args.date_trigger
    await q.page.save()
