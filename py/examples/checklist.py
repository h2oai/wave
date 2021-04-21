# Form / Checklist
# Use a #checklist to group a set of related checkboxes.
# #form
# ---
from h2o_wave import main, app, Q, ui


@app('/demo')
async def serve(q: Q):
    if q.args.show_inputs:
        q.page['example'].items = [
            ui.text(f'selected={q.args.checklist}'),
            ui.button(name='show_form', label='Back', primary=True),
        ]
    else:
        q.page['example'] = ui.form_card(box='1 1 4 10', items=[
            ui.checklist(name='checklist', label='Choices',
                         choices=[ui.choice(name=x, label=x) for x in ['Egg', 'Bacon', 'Spam']]),
            ui.button(name='show_inputs', label='Submit', primary=True),
        ])
    await q.page.save()
