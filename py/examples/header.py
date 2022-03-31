# Header
# Use a header card to display a page #header.
# ---
from h2o_wave import site, ui

image = 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&h=750&w=1260'
commands = [
    ui.command(name='profile', label='Profile', icon='Contact'),
    ui.command(name='preferences', label='Preferences', icon='Settings'),
    ui.command(name='logout', label='Logout', icon='SignOut'),
]
page = site['/demo']
page['header1'] = ui.header_card(
    box='1 1 9 1',
    title='Transparent header',
    subtitle='And now for something completely different!',
    image='https://wave.h2o.ai/img/h2o-logo.svg',
    items=[
        ui.button(name='btn1', label='Button 1'),
        ui.button(name='btn2', label='Button 2'),
        ui.button(name='btn3', label='Button 3'),
    ],
    secondary_items=[ui.textbox(name='search', icon='Search', width='300px', placeholder='Search...')],
    color='transparent'
)
page['header2'] = ui.header_card(
    box='1 2 9 1',
    title='Card color header',
    subtitle='And now for something completely different!',
    items=[ui.menu(image=image, items=commands)],
    secondary_items=[
        ui.button(name='btn1', label='Link 1', link=True),
        ui.button(name='btn2', label='Link 2', link=True),
        ui.button(name='btn3', label='Link 3', link=True),
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
    color='card',
)
page['header3'] = ui.header_card(
    box='1 3 9 1',
    title='Primary color header',
    subtitle='And now for something completely different!',
    icon='Cycling',
    icon_color='$card',
    items=[ui.menu(icon='Add', items=commands)],
    secondary_items=[
        ui.tabs(name='menu', value='email', link=True, items=[
            ui.tab(name='email', label='Mail', icon='Mail'),
            ui.tab(name='events', label='Events', icon='Calendar'),
            ui.tab(name='spam', label='Spam', icon='Heart'),
        ]),
    ]
)
page.save()
