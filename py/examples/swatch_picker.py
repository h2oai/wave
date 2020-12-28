# Form / Swatch Picker
# Use a swatch picker to allow users to choose a from a specific set of colors.
# #swatch_picker #form
# ---
from h2o_wave import main, app, Q, ui


@app('/demo')
async def serve(q: Q):
    if q.args.show_inputs:
        q.page['example'].items = [
            ui.text(f'swatch={q.args.swatch}'),
            ui.button(name='show_form', label='Back', primary=True),
        ]
    else:
        q.page['example'] = ui.form_card(box='1 1 4 10', items=[
            ui.color_picker(
                name='swatch',
                label='Pick a swatch',
                choices=[
                    '#011627', '#2EC4B6', '#E71D36', '#FF9F1C', '#50514F',
                    '#F25F5C', '#FFE066', '#247BA0', '#70C1B3', '#FDFFFC',
                ]),
            ui.button(name='show_inputs', label='Submit', primary=True),
        ])
    await q.page.save()
