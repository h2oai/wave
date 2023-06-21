# Chatbot
# Infinite scroll for previous messages.
# #chatbot #infinite #scroll
# ---
from h2o_wave import main, app, Q, ui, data

prev_messages = [{'content': f'Message {i}', 'from_user': i % 2 == 0} for i in range(100)]
LOAD_SIZE = 10


@app('/demo')
async def serve(q: Q):
    if not q.client.initialized:
        q.client.current_load_page = len(prev_messages)
        # Use list buffer to allow easy streaming. Must have exactly 2 fields - msg and from_user.
        q.page['example'] = ui.chatbot_card(
            box='1 1 5 5',
            data=data(fields='content from_user', t='list', rows=[
                ['Hello', True],
                ['Hi', False],
                ['Hello', True],
                ['Hi', False],
                ['Hello', True],
                ['Hi', False],
                ['Hello', True],
                ['Hi', False],
            ]),
            events=['scroll_up'],
            name='chatbot'
        )
        q.client.initialized = True

    # A new message arrived.
    if q.args.chatbot:
        # Append user message.
        q.page['example'].data += [q.args.chatbot, True]
        # Append bot response.
        q.page['example'].data += ['I am a fake chatbot. Sorry, I cannot help you.', False]

    # User scrolled up, load chat history.
    if q.events.chatbot and q.events.chatbot.scroll_up:
        end = q.client.current_load_page - LOAD_SIZE
        q.page['example'].prev_items = prev_messages[end:q.client.current_load_page]
        q.client.current_load_page = end

    await q.page.save()
