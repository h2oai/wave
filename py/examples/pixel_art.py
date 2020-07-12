# Pixel Art
# A card that demonstrates collaborative editing in Telesync.
# ---
from telesync import site, data, ui

page = site['/demo']
page.drop()

page.add('example', ui.pixel_art_card(
    box='1 1 4 6',
    title='Art',
    data=data('color', 16 * 16),
))
page.save()
