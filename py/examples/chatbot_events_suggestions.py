# Chatbot / Events/ Suggestions
# Use prompt suggestions to simplify user interaction.
# #chatbot #events #suggestions
# ---
from h2o_wave import main, app, Q, ui, data

first_suggestion = "I need more information about this."
second_suggestion = "I have another problem."
third_suggestion = "The information you provided is not correct."
fourth_suggestion = "I got this, thank you!"

@app('/demo')
async def serve(q: Q):
    if not q.client.initialized:
        q.page['meta'] = ui.meta_card(box='', layouts=[
            ui.layout(
                breakpoint='xs',
                zones=[
                    ui.zone('content')
                ]
            ),
        ])
        q.page['example'] = ui.chatbot_card(
            box='content',
            data=data(fields='content from_user', t='list', rows=[
                ['Hi, my files are not loaded after plugging my USB in.', True],
                ['Hi, I am glad I can assist you today! Have you tried turning your PC off and on again?', False]
            ]),
            name='chatbot',
            events=['prompt_suggestion'],
            prompt_suggestions=[
                ui.chat_prompt_suggestion('sug1', label=first_suggestion, caption='Click to get more information.'),
                # ui.chat_prompt_suggestion('sug1', label=second_suggestion),
                ui.chat_prompt_suggestion('sug2', label=second_suggestion),
                ui.chat_prompt_suggestion('sug3', label=third_suggestion),
                ui.chat_prompt_suggestion('sug4', label=fourth_suggestion),
            ],
            disabled=True
        )
        q.client.initialized = True

    # Handle prompt_suggestion event.
    elif q.events.chatbot and q.events.chatbot.prompt_suggestion:
        # Append user message based on the suggestion.
        if q.events.chatbot.prompt_suggestion == 'sug1':
            q.page['example'].data += [first_suggestion, True]
        elif q.events.chatbot.prompt_suggestion == 'sug2':
            q.page['example'].data += [second_suggestion, True]
        elif q.events.chatbot.prompt_suggestion == 'sug3':
            q.page['example'].data += [third_suggestion, True]
        elif q.events.chatbot.prompt_suggestion == 'sug4':
            q.page['example'].data += [fourth_suggestion, True]
        # Append bot response.
        q.page['example'].data += ['I am a fake chatbot. Sorry, I cannot help you.', False]
    
    await q.page.save()
