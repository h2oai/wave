# Form / Dropdown
# Use dropdowns to allow users to choose between available choices.
# #form #dropdown #choice
# ---
from h2o_wave import main, app, Q, ui

choices = [
    ui.choice('A', 'Option A'),
    ui.choice('B', 'Option B'),
    ui.choice('C', 'Option C', disabled=True),
    ui.choice('D', 'Option D'),
]


@app('/demo')
async def serve(q: Q):
    if q.args.show_inputs:
        q.page['example'].items = [
            ui.text(f'dropdown={q.args.dropdown}'),
            ui.text(f'dropdown_multi={q.args.dropdown_multi}'),
            ui.text(f'dropdown_disabled={q.args.dropdown_disabled}'),
            ui.button(name='show_form', label='Back', primary=True),
        ]
    else:
        q.page['example'] = ui.form_card(box='1 1 4 10', items=[
            ui.dropdown(name='dropdown', label='Pick one', value='B', required=True, choices=choices),
            ui.dropdown(name='dropdown_multi', label='Pick multiple', values=['B', 'D'], required=True,
                        choices=choices),
            ui.dropdown(name='dropdown_disabled', label='Pick one (Disabled)', value='B', choices=choices,
                        disabled=True),
            ui.button(name='show_inputs', label='Submit', primary=True),
        ])
    await q.page.save()
