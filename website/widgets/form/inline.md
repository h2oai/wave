---
title: Inline
keywords:
  - form
  - inline
custom_edit_url: null
---

By default, all form items are laid out vertically (top to bottom). For more complex forms though, this might not be enough and
that's where [ui.inline](/docs/api/ui#inline) comes into play. All you need to do is specify the `items` attribute, which accepts any form
component.

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

## Horizontal alignment (`justify`)

You can specify how the elements should be horizontally aligned using the `justify` parameter. The default value is `start`.

```py
items = [
    ui.button(name='primary_button', label='Primary', primary=True),
    ui.button(name='basic_caption_button', label='Secondary', caption='Caption'),
    ui.button(name='icon_button', icon='Heart', caption='Like'),
]

q.page['justify'] = ui.form_card(box='1 1 3 5', items=[
    ui.inline(items, justify='start'),
    ui.inline(items, justify='center'),
    ui.inline(items, justify='end'),
    ui.inline(items, justify='between'),
    ui.inline(items, justify='around'),
])
```

## Vertical alignment (`align`)

You can specify how the elements should be horizontally aligned using the `align` parameter. The default value is `center`.

```py
items = [
    ui.button(name='primary_button', label='Primary', primary=True),
    ui.button(name='basic_caption_button', label='Secondary', caption='Caption'),
    ui.button(name='icon_button', icon='Heart', caption='Like'),
]

q.page['align'] = ui.form_card(box='1 1 3 5', items=[
    ui.inline(items, align='start'),
    ui.inline(items, align='baseline'),
    ui.inline(items, align='center'),
    ui.inline(items, align='end'),
])
```
