# Chat room
# A card that displays a chat room.
# A chat room card can synchronize its state with other chat room cards at the same URL.
# Open `/demo` in multiple browsers and watch them synchronize in realtime.
# #collaboration
# ---
from h2o_wave import site, data, ui

page = site['/demo']
page.drop()

page.add('example', ui.chat_room_card(
    box='1 1 4 6',
    title='Chat room',
    # The data structure for the chat room must be defined exactly as below.
    # This chat room holds a maximum of 10 messages.
    # If you want the room to retain more messages, say 1000, set the size to -1000.
    data=data('user time message', -10),
))
page.save()
