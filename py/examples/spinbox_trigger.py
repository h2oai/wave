# Form / Spinbox / Trigger
# To handle live changes to a spinbox, enable the `trigger` attribute.
# #form #spinbox #trigger
# ---
from h2o_wave import main, app, Q, ui


@app('/demo')
async def serve(q: Q):
    if not q.client.initialized:
        q.page['example'] = ui.form_card(box='1 1 4 10', items=[
            ui.text(f'spinbox_trigger={q.args.spinbox_trigger}'),
            ui.spinbox(name='spinbox_trigger', label='Pick a number', trigger=True),
        ])
        q.client.initialized = True
    else:
        q.page['example'].items[0].text.content = f'Selected number: {q.args.spinbox_trigger}'
        q.page['example'].items[1].spinbox.value = q.args.spinbox_trigger

    await q.page.save()
