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

If you want to be able to stop a generation of the bot's response, you can show the *Stop generating* button by specifying `generating=True` prop. This button will emit the `stop` event once clicked. It can be accessed through `q.events.<chatbot_card_name>.stop`, where `chatbot_card_name` is the `name` attribute of the chatbot component.

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
