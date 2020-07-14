# Pixel Art
# A card that demonstrates collaborative editing in Telesync.
# [Open this link](/demo) in multiple browsers and watch them synchronize in realtime.
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
