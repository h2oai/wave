# Chatbot
# Use this card for chat interactions.
# #chat
# ---
from h2o_wave import main, app, Q, ui, data


MAX_MESSAGES = 100


@app('/')
async def serve(q: Q):
    if not q.client.initialized:
        # Cyclic buffer drops oldest messages when full.
        q.page['example'] = ui.chatbot_card(box='1 1 5 5', data=data(size=-MAX_MESSAGES), name='chatbot')
        q.client.initialized = True

    # A new message arrived.
    if q.args.chatbot:
        # Append user message.
        q.page['example'].data += [q.args.chatbot, True]
        # Append bot message.
        q.page['example'].data += ['', False]
        await q.page.save()

        # Stream bot response.
        stream = ''
        for w in 'I am a fake chatbot. Sorry, I cannot help you.'.split():
            await q.sleep(0.1)
            stream += w + ' '
            q.page['example'].data[-1] = [stream, False]
            await q.page.save()

    await q.page.save()
