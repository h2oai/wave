# Form / Checklist / Inline
# Use a #checklist to group a set of related checkboxes.
# #form
# ---
from h2o_wave import main, app, Q, ui


choices = ['Egg', 'Bacon', 'Spam', 'Hamburger', 'Banana', 'Orange', 'Strawberry', 'Apple']


@app('/demo')
async def serve(q: Q):
    if q.args.show_inputs:
        q.page['example'].items = [
            ui.text(f'selected={q.args.checklist}'),
            ui.button(name='show_form', label='Back', primary=True),
        ]
    else:
        q.page['example'] = ui.form_card(box='1 1 4 6', items=[
            ui.checklist(name='checklist', label='Choices', inline=True,
                         choices=[ui.choice(name=x, label=x) for x in choices]),
            ui.button(name='show_inputs', label='Submit', primary=True),
        ])
    await q.page.save()
