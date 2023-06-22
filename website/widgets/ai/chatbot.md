---
title: Chatbot
keywords:
  - chatbot
  - llm
custom_edit_url: null
---

An intuitive chatbot card for basic prompting, uselful when showcasing [LLM](https://www.techopedia.com/definition/34948/large-language-model-llm)s. The message text is interpreted as Markdown.

Check the full API at [ui.chatbot_card](/docs/api/ui#chatbot_card).

## Basic chatbot

```py
from h2o_wave import data

q.page['example'] = ui.chatbot_card(box='1 1 5 5', data=data(fields='content from_user', t='list'), name='chatbot')
q.page['example'].data = [
    ['Hello, buddy. Can you help me?', True],
    ['Sure, what you need?', False],
]
```

## With a stop button

Chatbot card supports [text streaming](/docs/examples/chatbot-stream) out of the box. Specifying the `generating` attribute renders a stop button that notifies the app about the user wishing to stop the stream. See [full example](/docs/examples/chatbot-events-stop) to learn more.

```py
from h2o_wave import data

q.page['example'] = ui.chatbot_card(
    box='1 1 5 5',
    name='chatbot', 
    generating=True,
    events=['stop']
)
q.page['example'].data = [
    ['Hello, buddy. Can you help me?', True],
    ['Sure, what you need?', False],
]
```

## With infinite scroll

Some chats can get lengthy very quickly. Use `scroll_up` event to avoid loading the whole chat history in a single go for better performance (loading smaller chunks is faster then loading a big one) and stability (too many messages can break the browser + user may not even want to see them all). See [this example](/docs/examples/chatbot-events-scroll) to learn more.

```py
from h2o_wave import data

q.page['example'] = ui.chatbot_card(
    box='1 1 5 5',
    name='chatbot', 
    generating=True,
    events=['scroll']
)
q.page['example'].data = [
    ['Hello, buddy. Can you help me?', True],
    ['Sure, what you need?', False],
]
```
