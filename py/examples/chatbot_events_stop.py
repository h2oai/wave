# Chatbot
# Use this card for chat interactions.
# #chat
# ---
from h2o_wave import main, app, Q, ui, data
import asyncio

async def stream_message(q, msg):
    stream = ''
    # Show the "Stop generating" button
    q.page['example'].generating = True
    for w in msg.split():
        await asyncio.sleep(0.3)
        stream += w + ' '
        q.page['example'].data[q.client.msg_num] = [stream, False]
        await q.page.save()
    # Hide the "Stop generating" button
    q.page['example'].generating = False
    await q.page.save()

@app('/demo')
async def serve(q: Q):
    if not q.client.initialized:
        # Use map buffer with sortable keys to store messages - allows indexing + streaming the chat messages.
        map_buffer = data(fields='msg fromUser')
        q.client.msg_num = 0
        q.page['example'] = ui.chatbot_card(box='1 1 5 5', data=map_buffer, name='chatbot', events=['stop'])
        q.page['meta'] = ui.meta_card(box='', theme='h2o-dark')
        q.client.initialized = True

    # Check if we get a stop event
    if q.events.chatbot:
        if q.events.chatbot.stop:
            # Cancel the streaming task
            q.client.task.cancel()
            # Hide the "Stop generating" button
            q.page['example'].generating = False
    # A new message arrived.
    elif q.args.chatbot:
        # Append user message.
        q.client.msg_num += 1
        q.page['example'].data[q.client.msg_num] = [q.args.chatbot, True]

        # Stream bot response.
        q.client.msg_num += 1
        chatbot_response = 'I am a fake chatbot. Sorry, I cannot help you.'
        # Create and run a task to stream the message
        q.client.task = asyncio.create_task(stream_message(q, chatbot_response))

    await q.page.save()