# Canvas
# A card that displays a freeform drawing canvas.
# A canvas card can synchronize its state with other canvas cards at the same URL.
# Open `/demo` in multiple browsers and watch them synchronize in realtime.
# #collaboration
# ---
from h2o_wave import site, data, ui

page = site['/demo']
page.drop()

page.add('example', ui.canvas_card(
    box='1 1 4 7',
    title='Sample Canvas',
    width=500,
    height=500,
    # The data structure for the canvas must be defined exactly as below.
    # This canvas holds a maximum of 100 items.
    # If you want the canvas to retain more items, say 1000, set the size to -1000.
    data=data('d', -100),
))
page.save()
