---
title: Tabs
keywords:
  - tabs
custom_edit_url: null
---

Use the tab card to navigate between two or more distinct content categories.

You can see the API for [ui.tab_card](/docs/api/ui#tab_card) or check the interactive example in the Tour app.

## Basic tabs

```py
q.page['example'] = ui.tab_card(box='1 1 4 1', items=[
        ui.tab(name='#menu/spam', label='Spam'),
        ui.tab(name='#menu/ham', label='Ham'),
        ui.tab(name='#menu/eggs', label='Eggs'),
        ui.tab(name='#about', label='About'),
    ]
)
```

## With a selection

```py
q.page['example'] = ui.tab_card( box='1 1 4 1', value='#menu/ham', items=[
        ui.tab(name='#menu/spam', label='Spam'),
        ui.tab(name='#menu/ham', label='Ham'),
        ui.tab(name='#menu/eggs', label='Eggs'),
        ui.tab(name='#about', label='About'),
    ]
)
```

## Tabs as links

```py
q.page['example'] = ui.tab_card( box='1 1 4 1', link=True, value='#about', items=[
        ui.tab(name='#menu/spam', label='Spam'),
        ui.tab(name='#menu/ham', label='Ham'),
        ui.tab(name='#menu/eggs', label='Eggs'),
        ui.tab(name='#about', label='About'),
    ]
)
```
