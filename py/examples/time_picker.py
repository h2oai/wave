# Form / TimePicker
# Use TimePicker to... // TODO: finish descriptions
# #form #timepicker
# ---
from h2o_wave import main, app, Q, ui


@app('/demo')
async def serve(q: Q):
    if q.args.show_inputs:
        q.page['example'].items = [
            ui.text(f'timepicker={q.args.timepicker}'),
            ui.button(name='show_form', label='Back', primary=True),
        ]
    else:
        q.page['example'] = ui.form_card(box='1 1 4 10', items=[
            ui.time_picker(name='timepicker'),
            ui.button(name='show_inputs', label='Submit', primary=True),
        ])
    await q.page.save()
