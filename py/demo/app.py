from h2o_wave import main, app, Q, ui


@app('/')
async def serve(q: Q):
    q.page['meta'] = ui.meta_card(box='', layouts=[ui.layout(breakpoint='xs', zones=[
        ui.zone(name='main', size='100vh', direction=ui.ZoneDirection.ROW, zones=[
            ui.zone(name='sidebar', size='250px'),
            ui.zone(name='body', zones=[
                ui.zone(name='header'),
                ui.zone(name='content', size='1'),
            ]),
        ])
    ])])

    q.page['sidebar'] = ui.nav_card(
        box='sidebar', title='', subtitle='', color='primary',
        image='https://www.h2o.ai/wp-content/themes/h2o2018/templates/dist/images/h2o_logo.svg', items=[
            ui.nav_group('Menu', items=[
                ui.nav_item(name='#menu/spam', label='Spam'),
                ui.nav_item(name='#menu/ham', label='Ham'),
                ui.nav_item(name='#menu/eggs', label='Eggs'),
            ]),
        ])
    q.page['header'] = ui.header_card(box='header', title='', subtitle='', items=[
        ui.textbox(name='search', icon='Search', width='300px', placeholder='Search...'),
    ])
    q.page['body'] = ui.form_card(box='content', items=[ui.text(content='Content')])
    await q.page.save()
