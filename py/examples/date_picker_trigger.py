# Form / Date Picker
# Use date picker with trigger flag to sync user input after selection.
# ---
from h2o_q import Q, listen, ui


async def main(q: Q):
    if not q.client.initialized:
        q.page['example'] = ui.form_card(box='1 1 4 10', items=[
            ui.text(f'date_trigger={q.args.date_trigger}'),
            ui.date_picker(name='date_trigger', label='Date picker with trigger', trigger=True),
        ])
        q.client.initialized = True
    else:
        q.page['example'].items[0] = ui.text(f'date_trigger={q.args.date_trigger}')
    await q.page.save()


if __name__ == '__main__':
    listen('/demo', main)
