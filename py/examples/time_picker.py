# Form / TimePicker
# Use time pickers to allow users to pick times.
# #form #timepicker
# ---
from h2o_wave import main, app, Q, ui


@app('/demo')
async def serve(q: Q):
    if q.args.show_inputs:
        q.page['example'].items = [
            ui.text(f'timepicker={q.args.timepicker}'),
            ui.text(f'timepicker_required={q.args.timepicker_required}'),
            ui.text(f'timepicker_disabled={q.args.timepicker_disabled}'),
            ui.text(f'timepicker_placeholder={q.args.timepicker_placeholder}'),
            ui.text(f'timepicker_h24={q.args.timepicker_h24}'),
            ui.text(f'timepicker_boundaries={q.args.timepicker_boundaries}'),
            ui.text(f'timepicker_step={q.args.timepicker_step}'),
            ui.button(name='show_form', label='Back', primary=True),
        ]
    else:
        q.page['example'] = ui.form_card(box='1 1 4 8', items=[
            ui.time_picker(name='timepicker', label="Standard time picker"),
            ui.time_picker(name='timepicker_required', label="Time picker - required", required=True),
            ui.time_picker(name='timepicker_disabled', label="Disabled time picker", value='11:15', disabled=True),
            ui.time_picker(name='timepicker_placeholder', label="Time picker with custom placeholder", placeholder='Select a time'),
            ui.time_picker(name='timepicker_h24', label="Time picker with 24 hour time format", hour_format='24', value="18:35"),
            ui.time_picker(name='timepicker_boundaries', label="Time picker with boundaries", min='10:00', max='18:00', value='13:36'),
            ui.time_picker(name='timepicker_step', label="Time picker with minutes step", minutes_step=10),
            ui.button(name='show_inputs', label='Submit', primary=True),
        ])
    await q.page.save()
