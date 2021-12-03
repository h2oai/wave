---
title: Copyable Text
keywords:
  - form
  - copyable_text
custom_edit_url: null
---

Do you have a text that your users need to copy-paste? Use `ui.copyable_text` that provides a copy to clipboard button for convenient copy-pasting when hovering over the container box.

Check the full API at [ui.copyable_text](/docs/api/ui#copyable_text).

```py
q.page['form'] = ui.form_card(
    box='1 1 2 2',
    items=[ui.copyable_text(label='Copyable text', value='Hello world!')]
)
```

## Multiline

If you need to display longer content, use the `multiline` attribute.

```py
multiline_content = '''Wave is truly awesome.
You should try all the features!'''

q.page['form'] = ui.form_card(
    box='1 1 2 2',
    items=[ui.copyable_text(label='Copyable text', value=multiline_content, multiline=True)]
)
```
