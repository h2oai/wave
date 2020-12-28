# Form / Color Picker
# Use a color picker to allow a user to select a color.
# #form #color_picker
# ---
from h2o_wave import main, app, Q, ui


@app('/demo')
async def serve(q: Q):
    if q.args.show_inputs:
        q.page['example'].items = [
            ui.text(f'color={q.args.color}'),
            ui.button(name='show_form', label='Back', primary=True),
        ]
    else:
        q.page['example'] = ui.form_card(box='1 1 4 10', items=[
            ui.color_picker(name='color', label='Pick a color', value='#F25F5C'),
            ui.button(name='show_inputs', label='Submit', primary=True),
        ])
    await q.page.save()
