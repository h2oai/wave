# Nav
# Use nav cards to display sidebar navigation.
# ---
from telesync import site, ui

page = site['/demo']

page['tabs'] = ui.nav_card(
    box='1 1 2 5',
    items=[
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

page.save()
