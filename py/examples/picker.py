# Form / Picker
# Use pickers to allow users to pick multiple values.
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
          ui.picker(name='picker', label='Picker showcase', items=[
            ui.picker_option(name='h2o'),
            ui.picker_option(name='artificial'),
            ui.picker_option(name='inteligence'),
            ui.picker_option(name='wins'),
          ]),
          ui.button(name='show_inputs', label='Submit', primary=True),
        ])
    await q.page.save()


if __name__ == '__main__':
    listen('/demo', main)
