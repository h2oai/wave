---
title: Message bar
keywords:
  - form
  - message-bar
custom_edit_url: null
---

A message bar is a fancier way of telling your users what's going on. Whether something finished with success or failure or to give them additional info/warning about
upcoming app maintenance. This component supports plaintext, markdown and even HTML!

Check the full API at [ui.message_bar](/docs/api/ui#message_bar).

```py
q.page['form'] = ui.form_card(
    box='1 1 4 6',
    items=[
        ui.message_bar(type='blocked', text='This action is blocked.'),
        ui.message_bar(type='error', text='This is an error message'),
        ui.message_bar(type='warning', text='This is a warning message.'),
        ui.message_bar(type='info', text='This is an information message.'),
        ui.message_bar(type='success', text='This is an success message.'),
        ui.message_bar(type='danger', text='This is a danger message.'),
        ui.message_bar(type='success', text='This is a **MARKDOWN** _message_.'),
        ui.message_bar(type='success', text='This is an <b>HTML</b> <i>message</i>.'),
    ]
)
```
