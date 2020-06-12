# Pixel Art
# No description available.
# ---
from telesync import Site, data, ui

site = Site()

page = site['/demo']
page.drop()

page.add('example', ui.pixel_art_card(
    box='1 1 4 6',
    title='Art',
    data=data('color', 16 * 16),
))
page.sync()
