# Chatbot / Events/ Suggestions
# Use suggestions to simplify user interaction.
# #chatbot #events #suggestions
# ---
from h2o_wave import main, app, Q, ui, data

# Dictionary containing label, caption and icon for each suggestion.
suggestions = {
    'sug1': ["Write a poem", "about H2O Wave", "Edit"],
    'sug2': ["Plan a trip", "to Europe", "Airplane"],
    'sug3': ["Give me ideas", "for a new project", "Lightbulb"],
    'sug4': ["Explain me", "CSS preprocessors", "Code"]
}


async def stream_bot_response(q: Q, message: str):
    stream = ''
    # Fake bot "thinking" time.
    await q.sleep(0.5)
    # Stream bot response.
    for w in 'I am a fake chatbot. Sorry, I cannot help you.'.split():
        await q.sleep(0.1)
        stream += w + ' '
        q.page['example'].data[-1] = [stream, False]
        await q.page.save()


@app('/demo')
async def serve(q: Q):
    if not q.client.initialized:
        q.page['example'] = ui.chatbot_card(
            box='1 1 5 5',
            data=data(fields='content from_user', t='list'),
            name='chatbot',
            placeholder='Ask me anything...',
            events=['suggestion'],
            suggestions=[ui.chat_suggestion(name, label=value[0], caption=value[1], icon=value[2]) for
                                name, value in suggestions.items()]
        )
        q.client.initialized = True

    elif q.events.chatbot or q.args.chatbot:
        # Clear suggestions.
        q.page['example'].suggestions = []

        # Handle user input.
        if q.args.chatbot:
            # Append user message typed manually.
            q.page['example'].data += [q.args.chatbot, True]
        else:
            label, caption, icon = suggestions[q.events.chatbot.suggestion]
            # Append user message based on the suggestion event.
            q.page['example'].data += [label + ' ' + caption, True]

        # Append bot response.
        q.page['example'].data += ['', False]
        # Update UI.
        await q.page.save()
        # Stream bot response.
        await stream_bot_response(q, 'I am a fake chatbot. Sorry, I cannot help you.')

    await q.page.save()
