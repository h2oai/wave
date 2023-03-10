---
title: Copyable Text
keywords:
  - form
  - copyable_text
custom_edit_url: null
---

Do you have a text that your users need to copy-paste? Use `ui.copyable_text` that provides a copy to clipboard button for convenient copy-pasting when hovering over the container box.

Check the full API at [ui.copyable_text](/docs/api/ui#copyable_text).

## Basic copyable text

```py
q.page['form'] = ui.form_card(
    box='1 1 2 2',
    items=[ui.copyable_text(label='Copyable text', value='Hello world!')]
)
```

## Multiline copyable text

If you need to display longer content, use the `multiline` attribute.

```py
multiline_content = '''Wave is truly awesome.
You should try all the features!'''

q.page['form'] = ui.form_card(
    box='1 1 2 2',
    items=[ui.copyable_text(label='Copyable text', value=multiline_content, multiline=True)]
)
```

## Height of copyable text

If you want to adjust the height of the copyable textbox, set the `height` attribute to your desired height in pixels (e.g. `'200px'`) or use `1` to fill the remaining card space.
The height will only take effect if `multiline` is set to `True`.

```py
multiline_content = '''Wave is truly awesome.
You should try all the features!
Like having a big textbox!'''

q.page['form'] = ui.form_card(
    box='1 1 2 8',
    items=[
        ui.copyable_text(label='Copyable text', value=multiline_content, multiline=True, height='200px'),
        ui.copyable_text(label='Copyable text', value=multiline_content, multiline=True, height='1')
    ]
)
```
