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
            ui.text(f'dropdown_multi={q.args.dropdown_multi}'),
        ]
    else:
        q.page['example'] = ui.form_card(box='1 1 4 7', items=[
            ui.dropdown(name='dropdown_multi', label='Pick multiple', values=['C', 'D'],
                        choices=choices),
        ])
    await q.page.save()
