# Template
# No description available.
# ---
from telesync import Site, pack,ui

site = Site()
page = site['/demo']
page.drop()

c = page.add('template_example', ui.template_card(
    box=f'1 1 2 1',
    title='Pricing',
    content='{{product}} costs {{price}}!',
    data=pack(dict(product='Coffee', price='$3.45')),
))
page.sync()
