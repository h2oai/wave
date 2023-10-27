# Chatbot / Events/ Feedback
# Use thumbs up/down to provide feedback on the chatbot's response.
# #chatbot #events #feedback
# ---
from h2o_wave import main, app, Q, ui, data

@app('/demo')
async def serve(q: Q):
    if not q.client.initialized:
        q.page['example'] = ui.chatbot_card(
            box='1 1 5 5',
            data=data(fields='content from_user', t='list'),
            name='chatbot',
            events=['feedback'],
            feedback=True
        )
        q.page['feedback'] = ui.form_card(
            box='1 6 5 2', 
            items=[
                ui.text_xl('Feedback'),
                ui.text(name='text', content='Did you find the answer helpful?'),
            ]
        )
        q.client.initialized = True

    # Handle feedback event.
    if q.events.chatbot and q.events.chatbot.feedback:
        # Process the feedback.
        q.page['feedback'].text.content = f'{q.events.chatbot.feedback}'
    # A new message arrived.
    elif q.args.chatbot:
        # Append user message.
        q.page['example'].data += [q.args.chatbot, True]
        # Append bot response.
        q.page['example'].data += ['I am a fake chatbot. Sorry, I cannot help you.', False]
    q.page['non-existent'].items = []
    
    await q.page.save()
