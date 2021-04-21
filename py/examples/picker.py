# Form / Picker
# Use pickers to allow users to select one or more choices, such as tags or files, from a list.
# #form #picker #choice
# ---
from h2o_wave import main, app, Q, ui


@app('/demo')
async def serve(q: Q):
    if q.args.show_inputs:
        q.page['example'].items = [
            ui.text(f'selected={q.args.picker}'),
            ui.button(name='show_form', label='Back', primary=True),
        ]
    else:
        q.page['example'] = ui.form_card(box='1 1 4 10', items=[
            ui.picker(name='picker', label='Place an order (try Spam, Eggs or Ham):', choices=[
                ui.choice(name='spam', label='Spam'),
                ui.choice(name='eggs', label='Eggs'),
                ui.choice(name='ham', label='Ham'),
                ui.choice(name='cheese', label='Cheese'),
                ui.choice(name='beans', label='Beans'),
                ui.choice(name='toast', label='Toast'),
            ], values='eggs'),
            ui.button(name='show_inputs', label='Submit', primary=True),
        ])
    await q.page.save()
