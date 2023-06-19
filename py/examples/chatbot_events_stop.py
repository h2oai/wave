# Chatbot / Events/ Stop
# Register the `stop` #event to emit Wave event when `Stop generating` button is clicked.
# #chatbot #events #stop
# ---
from h2o_wave import main, app, Q, ui, data
import asyncio


async def stream_message(q):
    stream = ''
    q.page['example'].data += [stream, False]
    # Show the "Stop generating" button
    q.page['example'].generating = True
    for w in 'I am a fake chatbot. Sorry, I cannot help you.'.split():
        await asyncio.sleep(0.3)
        stream += w + ' '
        q.page['example'].data[-1] = [stream, False]
        await q.page.save()
    # Hide the "Stop generating" button
    q.page['example'].generating = False
    await q.page.save()


@app('/demo')
async def serve(q: Q):
    if not q.client.initialized:
        q.page['example'] = ui.chatbot_card(
            box='1 1 5 5',
            data=data(fields='msg fromUser', t='list'),
            name='chatbot',
            events=['stop']
        )
        q.client.initialized = True

    # Handle the stop event.
    if q.events.chatbot and q.events.chatbot.stop:
        # Cancel the streaming task.
        q.client.task.cancel()
        # Hide the "Stop generating" button.
        q.page['example'].generating = False
    # A new message arrived.
    elif q.args.chatbot:
        # Append user message.
        q.page['example'].data += [q.args.chatbot, True]
        # Run the streaming within cancelable asyncio task.
        q.client.task = asyncio.create_task(stream_message(q))

    await q.page.save()
