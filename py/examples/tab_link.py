# Tab / Links
# Use tab cards to display tabs on a page.
# This examples render tabs styled as links.
# ---
from telesync import site, ui

page = site['/demo']

page['tabs'] = ui.tab_card(
    box='1 1 4 1',
    items=[
        ui.tab(name='#menu/spam', label='Spam'),
        ui.tab(name='#menu/ham', label='Ham'),
        ui.tab(name='#menu/eggs', label='Eggs'),
        ui.tab(name='#about', label='About'),
    ],
    link=True,
)

page.save()
