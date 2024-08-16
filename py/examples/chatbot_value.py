# Chatbot / Value
# Use this card for chatbot interactions.
# #chatbot #value
# ---
from h2o_wave import main, app, Q, ui, data

templates = {
    'template_poem': 'Write a poem about [SUBJECT]. Be creative and use [EMOTION] words.',
    'template_summarize': 'Summarize the following text with [WORD_COUNT] words maximum while keeping all of the important information: [PASTE_YOUR_TEXT_HERE]',
    'template_professional': 'Rewrite the following text professionally while sounding like a high-class writer: [PASTE_YOUR_TEXT_HERE]',
}

template_choices = [
    ui.choice('template_poem', 'Write a poem'),
    ui.choice('template_summarize', 'Summarize'),
    ui.choice('template_professional', 'Rewrite professionally'),
]

@app('/demo')
async def serve(q: Q):
    if not q.client.initialized:
        q.page['dropdown'] = ui.form_card(
            box='6 1 2 2', 
            items=[
                ui.dropdown(
                    name='dropdown', 
                    label='Select a template', 
                    value="template_poem", 
                    choices=template_choices, 
                    trigger=True)
            ]
        )
        q.page['example'] = ui.chatbot_card(
            box='1 1 5 5', 
            data=data('content from_user', t='list'), 
            name='chatbot', 
            value=templates['template_poem']
            )
        q.client.initialized = True

    # Handle template change.
    if q.args.dropdown:
        if q.args.dropdown == 'template_poem':
            q.page['example'].value = templates['template_poem']
        elif q.args.dropdown == 'template_summarize':
            q.page['example'].value = templates['template_summarize']
        elif q.args.dropdown == 'template_professional':
            q.page['example'].value = templates['template_professional']
    # A new message arrived.
    elif q.args.chatbot:
        # Append user message.
        q.page['example'].data += [q.args.chatbot, True]
        # Append bot response.
        q.page['example'].data += ['I am a fake chatbot. Sorry, I cannot help you.', False]

    await q.page.save()
