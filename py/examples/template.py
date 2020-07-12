# Template
# Use a template card to render dynamic content using a HTML template.
# ---
from telesync import site, pack, ui

page = site['/demo']
page.drop()

c = page.add('template_example', ui.template_card(
    box=f'1 1 2 1',
    title='Pricing',
    content='{{product}} costs {{price}}!',
    data=pack(dict(product='Coffee', price='$3.45')),
))
page.sync()
