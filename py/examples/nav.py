# Nav
# Use nav cards to display sidebar navigation.
# ---
from h2o_wave import site, ui

page = site['/demo']

github_logo_url = 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png'

page['tabs'] = ui.nav_card(
    box='1 1 2 5',
    items=[
        ui.nav_group('Menu', items=[
            ui.nav_item(name='#menu/spam', label='Spam'),
            ui.nav_item(name='#menu/ham', label='Ham'),
            ui.nav_item(name='#menu/eggs', label='Eggs'),
        ]),
        ui.nav_group('Help', items=[
            ui.nav_item(name='#about', label='About', icon='Help'),
            ui.nav_item(name='#support', label='Support', icon=github_logo_url),
        ])
    ],
)

page.save()
