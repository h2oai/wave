---
title: Chatbot
keywords:
  - chatbot
  - llm
custom_edit_url: null
---

An intuitive chatbot card for basic prompting, uselful when showcasing [LLM](https://www.techopedia.com/definition/34948/large-language-model-llm)s.

Check the full API at [ui.chatbot_card](/docs/api/ui#chatbot_card).

## Basic chatbot

```py
from h2o_wave import data

MAX_MESSAGES = 500

cyclic_buffer = data(fields='msg fromUser', size=-MAX_MESSAGES)
q.page['example'] = ui.chatbot_card(box='1 1 5 5', data=cyclic_buffer, name='chatbot')
q.page['example'].data = [
    ['Hello, buddy. Can you help me?', True],
    ['Sure, what you need?', False],
]
```

## With a stop button

If you wish to be able to stop the ongoing bot's response generation, you can show the *Stop generating* button by specifying `generating=True` prop.
When clicked, this button will emit the `stop` event if [the event is specified](#handling-events).

```py
from h2o_wave import data

MAX_MESSAGES = 500

cyclic_buffer = data(fields='msg fromUser', size=-MAX_MESSAGES)
q.page['example'] = ui.chatbot_card(box='1 1 5 5', data=cyclic_buffer, name='chatbot', generating=True)
q.page['example'].data = [
    ['Hello, buddy. Can you help me?', True],
    ['Sure, what you need?', False],
]
```

## Handling events

To be able to stop the ongoing response generation, you have to register a `stop` event by setting `events=['stop']`.
This event can be triggered by clicking the [*Stop generating* button](#with-a-stop-button) and it can be accessed through `q.events.<chatbot_card_name>.stop`, where `chatbot_card_name` is the `name` attribute of the chatbot component.

![chatbot events gif](/img/widgets/chatbot_events_stop.gif)

```py ignore {23,40,41}
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

    # A new message arrived.
    if q.args.chatbot:
        # Append user message.
        q.client.msg_num += 1
        q.page['example'].data[q.client.msg_num] = [q.args.chatbot, True]

        # Stream bot response.
        q.client.msg_num += 1
        chatbot_response = 'I am a fake chatbot. Sorry, I cannot help you.'
        # Create and run a task to stream the message
        q.client.task = asyncio.create_task(stream_message(q, chatbot_response))

    # Check if we get a stop event
    if q.events.chatbot:
        if q.events.chatbot.stop:
            # Cancel the streaming task
            q.client.task.cancel()
            # Hide the "Stop generating" button
            q.page['example'].generating = False

    await q.page.save()   
```
