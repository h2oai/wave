# Meta / Theme
# Change the base color theme of the app.
# ---
from h2o_wave import Q, ui, main, app, cypress, Cypress


@app('/demo')
async def serve(q: Q):
    if not q.client.initialized:
        q.page['meta'] = ui.meta_card(box='')
        q.page['controls'] = ui.form_card(box='1 1 2 2', items=[
            ui.text_xl('This is normal theme'),
            ui.button(name='change', label='Change to see neon theme', primary=True)
        ])
        q.client.current_theme = 'light'
        q.client.initialized = True

    meta = q.page['meta']
    controls = q.page['controls']

    if q.args.change and q.client.current_theme != 'neon':
        meta.theme = 'neon'
        q.client.current_theme = 'neon'
        controls.items[0].text_xl.content = 'This is Neon theme!'
        controls.items[1].button.label = 'Back to normal'
    elif q.args.change:
        meta.theme = 'light'
        q.client.current_theme = 'light'
        controls.items[0].text_xl.content = 'This is normal theme'
        controls.items[1].button.label = 'Change to see neon theme'

    await q.page.save()
