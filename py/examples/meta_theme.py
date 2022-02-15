# Meta / Theme
# Change the base color theme of the app.
# ---
from h2o_wave import Q, ui, main, app


@app('/demo')
async def serve(q: Q):
    if not q.client.initialized:
        q.page['meta'] = ui.meta_card(box='', theme='neon')
        q.page['controls'] = ui.form_card(box='1 1 2 8', items=[
            ui.text_xl('Form'),
            ui.textbox(name='textbox', label='Textbox'),
            ui.toggle(name='toggle', label='Toggle'),
            ui.choice_group(name='choice_group', label='Choice group', choices=[
                ui.choice(name=x, label=x) for x in ['Egg', 'Bacon', 'Spam']
            ]),
            ui.checklist(name='checklist', label='Checklist', choices=[
                ui.choice(name=x, label=x) for x in ['Egg', 'Bacon', 'Spam']
            ]),
            ui.dropdown(name='dropdown', label='Dropdown', choices=[
                ui.choice(name=x, label=x) for x in ['Egg', 'Bacon', 'Spam']
            ]),
            ui.slider(name='slider', label='Slider'),
            ui.button(name='toggle_theme', label='Toggle Theme', primary=True)
        ])
        q.client.theme = 'default'
        q.client.initialized = True

    meta = q.page['meta']

    if q.args.toggle_theme:
        meta.theme = q.client.theme = 'neon' if q.client.theme == 'default' else 'default'

    await q.page.save()
