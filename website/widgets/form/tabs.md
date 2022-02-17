---
title: Tabs
keywords:
  - form
  - tabs
custom_edit_url: null
---

Use this component when you want to navigate between multiple groups of related content.

The `name` attribute indicates how to reference this component in the query arguments: `q.args.<name-attr>`.

You can see the API for [ui.tabs](/docs/api/ui#tabs) or check the interactive example in Tour app.

## Basic tabs

```py
q.page['example'] = ui.form_card(box='1 1 2 2', items=[
    ui.tabs(name='tabs', items=[
        ui.tab(name='tab1', label='Tab 1'),
        ui.tab(name='tab2', label='Tab 2'),
        ui.tab(name='tab3', label='Tab 3'),
    ])
])
```

## Setting initial values

Use the `value` attribute to control the preselected state of the tabs. If not specified,
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

## With icons

Polish your tabs with [icons](/docs/icons), it's simple!

```py
q.page['example'] = ui.form_card(box='1 1 2 2', items=[
    ui.tabs(name='tabs', items=[
        ui.tab(name='tab1', label='Tab 1', icon='Home'),
        ui.tab(name='tab2', label='Tab 2', icon='Heart'),
        ui.tab(name='tab3', label='Tab 3', icon='Cake'),
    ])
])
```

## With links

If you prefer textual look over default buttons, use the `link` attribute.

```py
q.page['example'] = ui.form_card(box='1 1 2 2', items=[
    ui.tabs(name='tabs', value='tab1', link=True, items=[
        ui.tab(name='tab1', label='Tab 1', icon='Home'),
        ui.tab(name='tab2', label='Tab 2', icon='Heart'),
        ui.tab(name='tab3', label='Tab 3', icon='Cake'),
    ])
])
```
