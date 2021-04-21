# Chat room
# A card that displays a chat room.
# A chat room card can synchronize its state with other chat room cards at the same URL.
# Open `/demo` in multiple browsers and watch them synchronize in realtime.
# #collaboration
# ---
from h2o_wave import site, data, ui

page = site['/demo']
page.drop()

page.add('example', ui.chat_card(
    box='1 1 4 6',
    title='Chat room',
    data=dict(),
))
page.save()
