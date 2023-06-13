# Chatbot
# Use this card for chat interactions.
# #chat
# ---
from h2o_wave import main, app, Q, ui, data


MAX_MESSAGES = 500


@app('/demo')
async def serve(q: Q):
    if not q.client.initialized:
        # Cyclic buffer drops oldest messages when full. Must have exactly 2 fields - msg and fromUser.
        # Useful for append and forget chatbots. Cyclic buffer is not suitable for streaming.
        cyclic_buffer = data(fields='msg fromUser', size=-MAX_MESSAGES)
        q.page['example'] = ui.chatbot_card(box='1 1 5 5', data=cyclic_buffer, name='chatbot')
        q.client.initialized = True

    # A new message arrived.
    if q.args.chatbot:
        # Append user message.
        q.page['example'].data += [q.args.chatbot, True]
        # Append bot response.
        q.page['example'].data += ['I am a fake chatbot. Sorry, I cannot help you.', False]

    await q.page.save()
