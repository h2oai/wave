# Form / Slider
# Use a #slider to allow users to set a value within a specific range.
# #form
# ---
from h2o_wave import main, app, Q, ui


@app('/demo')
async def serve(q: Q):
    if q.args.show_inputs:
        q.page['example'].items = [
            ui.text(f'slider={q.args.slider}'),
            ui.text(f'slider_zero={q.args.slider_zero}'),
            ui.text(f'slider_disabled={q.args.slider_disabled}'),
            ui.button(name='show_form', label='Back', primary=True),
        ]
    else:
        q.page['example'] = ui.form_card(box='1 1 4 10', items=[
            ui.slider(name='slider', label='Standard slider', min=0, max=100, step=10, value=30),
            ui.slider(name='slider_zero', label='Origin from zero', min=-10, max=10, step=1, value=-3),
            ui.slider(name='slider_disabled', label='Disabled slider', min=0, max=100, step=10, value=30,
                      disabled=True),
            ui.button(name='show_inputs', label='Submit', primary=True),
        ])
    await q.page.save()
