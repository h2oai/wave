# Form / Visible
# Use "visible" property to control whether form element should be shown / hidden.
# ---
from h2o_wave import main, app, Q, ui, pack, data


@app('/demo')
async def serve(q: Q):
    if not q.client.initialized:
        q.page['example'] = ui.form_card(box='1 1 4 10', items=[
            ui.text_xl(content='First text'),
            ui.text_l(content='Second text'),
            ui.text_m(content='Third text'),
            ui.text_s(content='Fourth text'),
            ui.inline([
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
    items = q.page['example'].items
    items_to_hide = [
        items[0].text_xl,
        items[2].text_m,
        items[4].inline.items[0].button,
        items[5].buttons.items[2].button
    ]
    if q.args.hide:
        for i in items_to_hide:
            i.visible = False
    if q.args.show:
        for i in items_to_hide:
            i.visible = True
    await q.page.save()
