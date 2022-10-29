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

choices_dialog = [ui.choice(str(i), f'Option {i}') for i in range(1, 102)]


@app('/demo')
async def serve(q: Q):
    if q.args.show_inputs:
        q.page['example'].items = [
            ui.text(f'dropdown={q.args.dropdown}'),
            ui.text(f'dropdown_multi={q.args.dropdown_multi}'),
            ui.text(f'dropdown_disabled={q.args.dropdown_disabled}'),
            ui.text(f'dropdown_dialog={q.args.dropdown_dialog}'),
            ui.text(f'dropdown_popup_always={q.args.dropdown_popup_always}'),
            ui.text(f'dropdown_popup_never={q.args.dropdown_popup_never}'),
            ui.button(name='show_form', label='Back', primary=True),
        ]
    else:
        q.page['example'] = ui.form_card(box='1 1 4 7', items=[
            ui.dropdown(name='dropdown', label='Pick one', value='B', required=True, choices=choices),
            ui.dropdown(name='dropdown_multi', label='Pick multiple', values=['B', 'D'], required=True,
                        choices=choices),
            ui.dropdown(name='dropdown_disabled', label='Pick one (Disabled)', value='B', choices=choices,
                        disabled=True),
            ui.dropdown(name='dropdown_dialog', label='Pick multiple in dialog (>100 choices)', values=['1'],
                        required=True, choices=choices_dialog),
            ui.dropdown(name='dropdown_popup_always', label='Always show popup even when choices < 100', value='A',
                        required=True, choices=choices, popup='always'),
            ui.dropdown(name='dropdown_popup_never', label='Never show popup even when choices > 100', value='1',
                        required=True, choices=choices_dialog, popup='never'),
            ui.button(name='show_inputs', label='Submit', primary=True),
        ])
    await q.page.save()
