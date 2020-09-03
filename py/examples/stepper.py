# Stepper
# Use Stepper to show progress through numbered steps.
# ---
from h2o_q import Q, listen, ui


async def main(q: Q):
    q.page['basic-stepper'] = ui.form_card(
        box='1 1 4 1',
        items=[
          ui.stepper(name='basic-stepper', items=[
            ui.step(label='Step 1'),
            ui.step(label='Step 2'),
            ui.step(label='Step 3'),
          ])
        ]
    )
    q.page['icon-stepper'] = ui.form_card(
        box='1 2 4 1',
        items=[
          ui.stepper(name='icon-stepper', items=[
            ui.step(label='Step 1', icon='MailLowImportance'),
            ui.step(label='Step 2', icon='TaskManagerMirrored'),
            ui.step(label='Step 3', icon='Cafe'),
          ])
        ]
    )
    q.page['almost-done-stepper'] = ui.form_card(
        box='1 3 4 1',
        items=[
          ui.stepper(name='almost-done-stepper', items=[
            ui.step(label='Step 1', done=True),
            ui.step(label='Step 2', done=True),
            ui.step(label='Step 3'),
          ])
        ]
    )
    await q.page.save()


if __name__ == '__main__':
    listen('/demo', main)
