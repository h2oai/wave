---
title: Tabs 
keywords:
  - form
  - tabs
custom_edit_url: null
---

Use this component when you want to navigate between multiple groups of related content.

```py
q.page['example'] = ui.form_card(box='1 1 2 2', items=[
    ui.tabs(name='tabs', items=[
        ui.tab(name='tab1', label='Tab 1'),
        ui.tab(name='tab2', label='Tab 2'),
        ui.tab(name='tab3', label='Tab 3'),
    ])
])
```

## Default value

Use `value` attribute in order to control preselected state of the tabs. If not specified,
the first tab is selected by default.

```py
q.page['example'] = ui.form_card(box='1 1 2 2', items=[
    ui.tabs(name='tabs', value='tab2', items=[
        ui.tab(name='tab1', label='Tab 1'),
        ui.tab(name='tab2', label='Tab 2'),
        ui.tab(name='tab3', label='Tab 3'),
    ])
])
```

## Icons

Polish your tabs with [icons](https://uifabricicons.azurewebsites.net/), it's simple!

```py
q.page['example'] = ui.form_card(box='1 1 2 2', items=[
    ui.tabs(name='tabs', items=[
        ui.tab(name='tab1', label='Tab 1', icon='Home'),
        ui.tab(name='tab2', label='Tab 2', icon='Heart'),
        ui.tab(name='tab3', label='Tab 3', icon='Cake'),
    ])
])
```

## Links

If you prefer textual look over default buttons, use `link` attribute.

```py
q.page['example'] = ui.form_card(box='1 1 2 2', items=[
    ui.tabs(name='tabs', link=True, items=[
        ui.tab(name='tab1', label='Tab 1', icon='Home'),
        ui.tab(name='tab2', label='Tab 2', icon='Heart'),
        ui.tab(name='tab3', label='Tab 3', icon='Cake'),
    ])
])
```
