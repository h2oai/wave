---
title: Inline
keywords:
  - form
  - inline
custom_edit_url: null
---

By default, all form items are laid out vertically (top to bottom). For more complex forms though, this might not be enough and
that's where [ui.inline](/docs/api/ui#inline) comes into play. All you need to do is specify the `items` attribute, which accepts any form
component. Optionally, you can also specify `justify` if you want to control the alignment too.

```py
q.page['form'] = ui.form_card(
    box='1 1 4 2',
    items=[ui.inline(items=[
        ui.textbox(name='textbox1', label='Textbox 1'),
        ui.textbox(name='textbox2', label='Textbox 2'),
        ui.textbox(name='textbox3', label='Textbox 3'),
    ])],
)
```

Check the full API at [ui.inline](/docs/api/ui#inline).
