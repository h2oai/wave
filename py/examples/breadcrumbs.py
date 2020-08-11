# Breadcrumbs
# Use breadcrumbs cards to show actual position within navigation.
# ---
from h2o_q import site, ui

page = site['/demo']

page['breadcrumbs'] = ui.breadcrumbs_card(
    box='1 1 4 -1',
    items=[
        ui.breadcrumb_item(name='#menu1', label='Menu 1'),
        ui.breadcrumb_item(name='#menu2', label='Menu 2'),
        ui.breadcrumb_item(name='#menu3', label='Menu 3'),
    ],
)

page.save()
