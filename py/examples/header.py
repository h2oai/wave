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
        ui.header_item(name='menu1', label='Menu 1', items=[
            ui.header_item(name='#submenu1', label='SubMenu 1'),
            ui.header_item(name='#submenu2', label='SubMenu 2'),
            ui.header_item(name='#submenu3', label='SubMenu 3', items=[
                ui.header_item(name='#subsubmenu1', label='SubSubMenu 1'),
                ui.header_item(name='#subsubmenu2', label='H2O this window', path='https://www.h2o.ai/'),
                ui.header_item(name='#h2o_new', label='H2O new window', path='https://www.h2o.ai/', target='_blank'),
            ]),
        ]),
        ui.header_item(name='#submenu2', label='Menu 2'),
        ui.header_item(name='#submenu3', label='Menu 3'),
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
