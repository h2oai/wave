# Form / Choice Group
# Use choice groups to let users select one option from two or more choices.
# ---
from h2o_q import Q, listen, ui

choices = [
    ui.choice('A', 'Option A'),
    ui.choice('B', 'Option B'),
    ui.choice('C', 'Option C', disabled=True),
    ui.choice('D', 'Option D'),
]


async def main(q: Q):
    if q.args.show_inputs:
        q.page['example'].items = [
            ui.text(f'selected={q.args.choice_group}'),
            ui.button(name='show_form', label='Back', primary=True),
        ]
    else:
        q.page['example'] = ui.form_card(box='1 1 4 10', items=[
            ui.choice_group(name='choice_group', label='Pick one', value='B', required=True, choices=choices),
            ui.button(name='show_inputs', label='Submit', primary=True),
        ])
    await q.page.save()


if __name__ == '__main__':
    listen('/demo', main)
