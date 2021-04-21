# Form / Range Slider
# Use a #range #slider to allow users to select a value range (from, to).
# #form
# ---
from h2o_wave import main, app, Q, ui


@app('/demo')
async def serve(q: Q):
    if q.args.show_inputs:
        q.page['example'].items = [
            ui.text(f'range_slider={q.args.range_slider}'),
            ui.text(f'range_slider_step={q.args.range_slider_step}'),
            ui.text(f'range_slider_disabled={q.args.range_slider_disabled}'),
            ui.button(name='show_form', label='Back', primary=True),
        ]
    else:
        q.page['example'] = ui.form_card(box='1 1 4 10', items=[
            ui.range_slider(name='range_slider', label='Default slider'),
            ui.range_slider(name='range_slider_step', label='Step slider', min=0, max=1000, step=100, min_value=0,
                            max_value=100),
            ui.range_slider(name='range_slider_disabled', label='Disabled slider', min=0, max=100, step=10, min_value=0,
                            max_value=70, disabled=True),
            ui.button(name='show_inputs', label='Submit', primary=True),
        ])
    await q.page.save()
