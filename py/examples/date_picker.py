# Form / Date Picker
# Use date pickers to allow users to pick dates.
# #form #date_picker
# ---
from h2o_wave import main, app, Q, ui


@app('/demo')
async def serve(q: Q):
    if q.args.show_inputs:
        q.page['example'].items = [
            ui.text(f'date={q.args.date}'),
            ui.text(f'date_placeholder={q.args.date_placeholder}'),
            ui.text(f'date_disabled={q.args.date_disabled}'),
            ui.button(name='show_form', label='Back', primary=True),
        ]
    else:
        q.page['example'] = ui.form_card(box='1 1 4 10', items=[
            ui.date_picker(name='date', label='Standard date picker', value='2017-10-19'),
            ui.date_picker(name='date_placeholder', label='Date picker with placeholder', placeholder='Pick a date'),
            ui.date_picker(name='date_disabled', label='Disabled date picker', value='2017-10-19', disabled=True),
            ui.button(name='show_inputs', label='Submit', primary=True),
        ])
    await q.page.save()
