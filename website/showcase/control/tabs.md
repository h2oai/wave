---
title: Tabs
keywords:
  - tabs
custom_edit_url: null
---

Use tab card to navigate between two or more distinct content categories.

```py
q.page['example'] = ui.tab_card(
    box='1 1 4 1',
    items=[
        ui.tab(name='#menu/spam', label='Spam'),
        ui.tab(name='#menu/ham', label='Ham'),
        ui.tab(name='#menu/eggs', label='Eggs'),
        ui.tab(name='#about', label='About'),
    ]
)
```

## Initial value

```py
q.page['example'] = ui.tab_card(
    box='1 1 4 1',
    items=[
        ui.tab(name='#menu/spam', label='Spam'),
        ui.tab(name='#menu/ham', label='Ham'),
        ui.tab(name='#menu/eggs', label='Eggs'),
        ui.tab(name='#about', label='About'),
    ],
    value='#menu/ham'
)
```
