# Chatbot
# Use this card for chatbot interactions.
# #chatbot
# ---
from h2o_wave import main, app, Q, ui, data


@app('/demo')
async def serve(q: Q):
    if not q.client.initialized:
        # List buffer is a dynamic array. Cyclic buffer can also be used. Must have exactly 2 fields - content and from_user.
        q.page['example'] = ui.chatbot_card(box='1 1 5 5', data=data('content from_user', t='list'), name='chatbot')
        q.client.initialized = True

    # A new message arrived.
    if q.args.chatbot:
        # Append user message.
        q.page['example'].data += [q.args.chatbot, True]
        # Append bot response.
        q.page['example'].data += ['I am a fake chatbot. Sorry, I cannot help you.', False]

    await q.page.save()
