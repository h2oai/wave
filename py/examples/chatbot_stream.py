# Chatbot / Stream
# Use this card for chatbot interactions, supports text streaming.
# #chatbot #stream
# ---
from h2o_wave import main, app, Q, ui, data


@app('/demo')
async def serve(q: Q):
    if not q.client.initialized:
        # Use list buffer to allow easy streaming. Must have exactly 2 fields - content and from_user.
        q.page['example'] = ui.chatbot_card(box='1 1 5 5', data=data(fields='content from_user', t='list'), name='chatbot')
        q.client.initialized = True

    # A new message arrived.
    if q.args.chatbot:
        # Append user message.
        q.page['example'].data += [q.args.chatbot, True]
        # Append bot response.
        q.page['example'].data += ['', False]

        # Stream bot response.
        stream = ''
        for w in 'I am a fake chatbot. Sorry, I cannot help you.'.split():
            await q.sleep(0.1)
            stream += w + ' '
            q.page['example'].data[-1] = [stream, False]
            await q.page.save()

    await q.page.save()
