# Form / Choice Group / Inline
# Use #choice groups to let users select one option from two or more choices and inline to present the choices horizontally.
# #form #choice_group #inline
# ---
from h2o_wave import main, app, Q, ui

choices = [
    ui.choice('A', 'Option A'),
    ui.choice('B', 'Option B'),
    ui.choice('C', 'Option C', disabled=True),
    ui.choice('D', 'Option D'),
    ui.choice('E', 'Option E'),
    ui.choice('F', 'Option F'),
    ui.choice('G', 'Option H'),
    ui.choice('I', 'Option I'),
]


@app('/demo')
async def serve(q: Q):
    if q.args.show_inputs:
        q.page['example'].items = [
            ui.text(f'selected={q.args.choice_group}'),
            ui.button(name='show_form', label='Back', primary=True),
        ]
    else:
        q.page['example'] = ui.form_card(box='1 1 4 10', items=[
            ui.choice_group(name='choice_group', inline=True, label='Pick one',
                            value='B', required=True, choices=choices),
            ui.button(name='show_inputs', label='Submit', primary=True),
        ])
    await q.page.save()
