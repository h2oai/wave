---
title: Separator
keywords:
  - form
  - separator
custom_edit_url: null
---

The simplest way to group related fields is to use [ui.separator](/docs/api/ui#separator) which visually divides form into subsections.

```py
q.page['example'] = ui.form_card(
    box='1 1 2 4',
    items=[
        ui.separator(label='Separator 1'),
        ui.text('The quick brown fox jumps over the lazy dog.'),
        ui.separator(label='Separator 2'),
        ui.text('The quick brown fox jumps over the lazy dog.'),
        ui.separator(label='Separator 3'),
        ui.text('The quick brown fox jumps over the lazy dog.'),
    ]
)
```

Check the full API at [ui.separator](/docs/api/ui#separator).
