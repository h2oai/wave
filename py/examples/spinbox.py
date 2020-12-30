# Form / Spinbox
# Use a #spinbox to allow users to incrementally adjust a value in small steps.
# #form
# ---
from h2o_wave import main, app, Q, ui


@app('/demo')
async def serve(q: Q):
    if q.args.show_inputs:
        q.page['example'].items = [
            ui.text(f'spinbox={q.args.spinbox}'),
            ui.text(f'spinbox_disabled={q.args.spinbox_disabled}'),
            ui.button(name='show_form', label='Back', primary=True),
        ]
    else:
        q.page['example'] = ui.form_card(box='1 1 4 10', items=[
            ui.spinbox(name='spinbox', label='Standard spinbox', min=0, max=100, step=10, value=30),
            ui.spinbox(name='spinbox_disabled', label='Disabled spinbox', min=0, max=100, step=10, value=30,
                       disabled=True),
            ui.button(name='show_inputs', label='Submit', primary=True),
        ])
    await q.page.save()
