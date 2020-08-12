# Form / Picker / Selection
# Pre-select choices while displaying a picker.
# ---
from h2o_q import Q, listen, ui


async def main(q: Q):
    if q.args.show_inputs:
        q.page['example'].items = [
            ui.text(f'selected={q.args.picker}'),
            ui.button(name='show_form', label='Back', primary=True),
        ]
    else:
        q.page['example'] = ui.form_card(box='1 1 4 10', items=[
          ui.picker(name='picker', label='Picker with initial values', items=[
            ui.choice(name='spam', label='Spam'),
            ui.choice(name='eggs', label= 'Eggs'),
            ui.choice(name='ham', label= 'Ham'),
            ui.choice(name='cheese', label='Cheese'),
            ui.choice(name='beans', label='Beans'),
            ui.choice(name='toast', label='Toast'),
          ], values=['h2o','wins']),
          ui.button(name='show_inputs', label='Submit', primary=True),
        ])
    await q.page.save()


if __name__ == '__main__':
    listen('/demo', main)
