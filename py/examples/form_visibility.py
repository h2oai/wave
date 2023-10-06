# Form / Visible
# Use "visible" property to control whether form element should be shown / hidden.
# ---
from h2o_wave import main, app, Q, ui


@app('/demo')
async def serve(q: Q):
    if not q.client.initialized:
        q.page['example'] = ui.form_card(box='1 1 4 7', items=[
            ui.text_xl(name='text_xl', content='First text'),
            ui.text_l(name='text_l', content='Second text'),
            ui.text_m(name='text_m', content='Third text'),
            ui.text_s(name='text_s', content='Fourth text'),
            ui.buttons([
                ui.button(name='left1', label='Left1'),
                ui.button(name='left2', label='Left2'),
                ui.button(name='left3', label='Left3'),
            ]),
            ui.buttons(justify='end', items=[
                ui.button(name='right1', label='Right1'),
                ui.button(name='right2', label='Right2'),
                ui.button(name='right3', label='Right3'),
            ]),
            ui.buttons(items=[ui.button(name='show', label='Show'), ui.button(name='hide', label='Hide')])
        ])
        q.client.initialized = True
    page = q.page['example']
    items_to_hide = [
        page.text_xl,
        page.text_m,
        page.left1,
        page.right3,
    ]
    if q.args.hide:
        for i in items_to_hide:
            i.visible = False
    if q.args.show:
        for i in items_to_hide:
            i.visible = True
    await q.page.save()
