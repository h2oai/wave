---
title: Chatbot
keywords:
  - chatbot
  - llm
custom_edit_url: null
---

An intuitive chatbot card for basic prompting, uselful when showcasing [LLM](https://www.techopedia.com/definition/34948/large-language-model-llm)s.

Check the full API at [ui.chatbot_card](/docs/api/ui#chatbot_card).

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
