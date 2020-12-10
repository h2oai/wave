# Header
# Use a header card to display a page #header.
# ---
from h2o_wave import site, ui

page = site['/demo']
page['header1'] = ui.header_card(
    box='1 1 7 1',
    title='The Amazing Gonkulator',
    subtitle='And now for something completely different!',
    items=[
        ui.command(
            name='new', label='New', icon='Add', items=[
                ui.command(name='email', label='Email Message', icon='Mail'),
                ui.command(name='calendar', label='Calendar Event', icon='Calendar'),
            ]
        ),
        ui.command(name='upload', label='Upload', icon='Upload'),
        ui.command(name='share', label='Share', icon='Share'),
        ui.command(name='download', label='Download', icon='Download'),
    ],
    nav=[
        ui.nav_group('Menu', items=[
            ui.nav_item(name='#menu/spam', label='Spam'),
            ui.nav_item(name='#menu/ham', label='Ham'),
            ui.nav_item(name='#menu/eggs', label='Eggs'),
        ]),
        ui.nav_group('Help', items=[
            ui.nav_item(name='#about', label='About'),
            ui.nav_item(name='#support', label='Support'),
        ])
    ],
)
page['header2'] = ui.header_card(
    box='1 2 3 1',
    title='The Amazing Gonkulator',
    subtitle='And now for something completely different!',
    icon='Design',
)
page['header3'] = ui.header_card(
    box='1 3 3 1',
    title='The Amazing Gonkulator',
    subtitle='And now for something completely different!',
    icon='Cycling',
    icon_color='$violet',
)
page['header4'] = ui.header_card(
    box='1 4 3 1',
    title='The Amazing Gonkulator',
    subtitle='And now for something completely different!',
    icon='ExploreData',
    icon_color='$red',
)
page.save()
