# Form / Ordered Select
# Use ordered select when selection order matters.
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
            ui.text(f'ordered_select={q.args.ordered_select}'),
            ui.button(name='show_form', label='Back', primary=True),
        ]
    else:
        q.page['example'] = ui.form_card(box='1 1 4 10', items=[
            ui.ordered_select(name='ordered_select', label='Pick one', choices=choices),
            ui.button(name='show_inputs', label='Submit', primary=True),
        ])
    await q.page.save()
