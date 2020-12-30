# Form / Checkbox
# Use checkboxes to switch between two mutually exclusive options.
# #form #checkbox
# ---
from h2o_wave import main, app, Q, ui


@app('/demo')
async def serve(q: Q):
    if q.args.show_inputs:
        q.page['example'].items = [
            ui.text(f'checkbox_unchecked={q.args.checkbox_unchecked}'),
            ui.text(f'checkbox_checked={q.args.checkbox_checked}'),
            ui.text(f'checkbox_indeterminate={q.args.checkbox_indeterminate}'),
            ui.text(f'checkbox_unchecked_disabled={q.args.checkbox_unchecked_disabled}'),
            ui.text(f'checkbox_checked_disabled={q.args.checkbox_checked_disabled}'),
            ui.text(f'checkbox_indeterminate_disabled={q.args.checkbox_indeterminate_disabled}'),
            ui.button(name='show_form', label='Back', primary=True),
        ]
    else:
        q.page['example'] = ui.form_card(box='1 1 4 10', items=[
            ui.checkbox(name='checkbox_unchecked', label='Not checked'),
            ui.checkbox(name='checkbox_checked', label='Checked', value=True),
            ui.checkbox(name='checkbox_indeterminate', label='Indeterminate', indeterminate=True),
            ui.checkbox(name='checkbox_unchecked_disabled', label='Not checked (Disabled)', disabled=True),
            ui.checkbox(name='checkbox_checked_disabled', label='Checked (Disabled)', value=True, disabled=True),
            ui.checkbox(name='checkbox_indeterminate_disabled', label='Indeterminate (Disabled)', indeterminate=True,
                        disabled=True),
            ui.button(name='show_inputs', label='Submit', primary=True),
        ])
    await q.page.save()
