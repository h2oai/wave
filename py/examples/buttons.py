# Form / Buttons
# Use the `ui.buttons()` function to group related #buttons.
# #form
# ---
from h2o_wave import main, app, Q, ui


@app('/demo')
async def serve(q: Q):
    if 'standard_button' in q.args:
        q.page['example'].items = [
            ui.text(f'primary_button={q.args.primary_button}'),
            ui.text(f'standard_button={q.args.standard_button}'),
            ui.text(f'standard_disabled_button={q.args.standard_disabled_button}'),
            ui.button(name='show_form', label='Back', primary=True),
        ]
    else:
        q.page['example'] = ui.form_card(box='1 1 4 10', items=[
            ui.buttons([
                ui.button(name='primary_button', label='Primary', primary=True),
                ui.button(name='standard_button', label='Standard'),
                ui.button(name='standard_disabled_button', label='Standard', disabled=True),
            ]),
        ])
    await q.page.save()
