# Form / Combobox
# Use comboboxes to allow users to either choose between available choices or indicate a choice by free-form editing.
# #form #combobox
# ---
from h2o_wave import main, app, Q, ui

combobox_choices = ['Cyan', 'Magenta', 'Yellow', 'Black']


@app('/demo')
async def serve(q: Q):
    if q.args.show_inputs:
        q.page['example'].items = [
            ui.text(f'combobox={q.args.combobox}'),
            ui.text(f'combobox_disabled={q.args.combobox_disabled}'),
            ui.text(f'combobox_error={q.args.combobox_error}'),
            ui.button(name='show_form', label='Back', primary=True),
        ]
    else:
        q.page['example'] = ui.form_card(box='1 1 4 10', items=[
            ui.combobox(name='combobox', label='Enter or choose a color', placeholder='Color...', value='Blue',
                        choices=combobox_choices),
            ui.combobox(name='combobox_disabled', label='Enter or choose a color', placeholder='Color...', value='Blue',
                        choices=combobox_choices, disabled=True),
            ui.combobox(name='combobox_error', label='Enter or choose a color', placeholder='Color...', value='Blue',
                        choices=combobox_choices, error='This combobox has an error!'),
            ui.button(name='show_inputs', label='Submit', primary=True),
        ])
    await q.page.save()
