---
title: Label
keywords:
  - form
  - label
custom_edit_url: null
---

Despite the fact most of the form elements have a label built-in, controlled by an attribute, it still sometimes makes sense to want your label. One example
could be having an interactive visualization on a form that requires user input. Wave supports standard, required and disabled states.

Check the full API at [ui.label](/docs/api/ui#label).

```py
q.page['form'] = ui.form_card(
    box='1 1 2 2',
    items=[
        ui.label(label='Standard Label'),
        ui.label(label='Required Label', required=True),
        ui.label(label='Disabled Label', disabled=True),
    ]
)
```
