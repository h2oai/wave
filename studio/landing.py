from h2o_wave import site, ui

page = site['/']

page['landing'] = ui.form_card(box='1 1 -1 -1', items=[
    ui.inline(
        direction='column',
        align='center',
        justify='center',
        height='1',
        items=[
            ui.text_xl('# 👋 Welcome to H2O Wave Studio'),
            ui.text('The app is listening on `/studio` route.'),
            ui.link(label='Start coding', path='/studio', button=True, target='_self'),
        ]
    ),
])

page.save()
