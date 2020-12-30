# Form / Button
# Use #buttons to enable a user to commit a change or complete steps in a task.
# #form
# ---
from h2o_wave import main, app, Q, ui


@app('/demo')
async def serve(q: Q):
    if 'basic_button' in q.args:
        q.page['example'].items = [
            ui.text(f'basic_button={q.args.basic_button}'),
            ui.text(f'primary_button={q.args.primary_button}'),
            ui.text(f'link_button={q.args.link_button}'),
            ui.text(f'basic_disabled_button={q.args.basic_disabled_button}'),
            ui.text(f'primary_disabled_button={q.args.primary_disabled_button}'),
            ui.text(f'link_disabled_button={q.args.link_disabled_button}'),
            ui.text(f'basic_compound_button={q.args.basic_compound_button}'),
            ui.text(f'primary_compound_button={q.args.primary_compound_button}'),
            ui.text(f'basic_compound_disabled_button={q.args.basic_compound_disabled_button}'),
            ui.text(f'primary_compound_disabled_button={q.args.primary_compound_disabled_button}'),
            ui.button(name='show_form', label='Back', primary=True),
        ]
    else:
        q.page['example'] = ui.form_card(box='1 1 4 10', items=[
            ui.button(name='basic_button', label='Basic'),
            ui.button(name='primary_button', label='Primary', primary=True),
            ui.button(name='link_button', label='Link', link=True),
            ui.button(name='basic_disabled_button', label='Basic (Disabled)', disabled=True),
            ui.button(name='primary_disabled_button', label='Primary (Disabled)', primary=True, disabled=True),
            ui.button(name='link_disabled_button', label='Link (Disabled)', link=True, disabled=True),
            ui.button(name='basic_compound_button', label='Basic', caption='Compound Button.'),
            ui.button(name='primary_compound_button', label='Primary', caption='Compound Button', primary=True),
            ui.button(name='basic_compound_disabled_button', label='Basic (Disabled)', caption='Compound Button',
                      disabled=True),
            ui.button(name='primary_compound_disabled_button', label='Primary (Disabled)', caption='Compound Button',
                      primary=True, disabled=True),
        ])
    await q.page.save()
