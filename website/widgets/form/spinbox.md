---
title: Spinbox
keywords:
  - form
  - spinbox
custom_edit_url: null
---

Use this component when you wish to collect numerical values.

A spinbox allows the user to pick a numerical value. This can be either achieved by typing the value
directly or adjusting it via little top / down arrows on the side. If you type in a value
that is out of boundaries (min/max), the appropriate boundary value will be used instead.

Note that if `trigger` is specified, the inputs are submitted after `500ms` of no typing activity. This threshold is currently not configurable.

The `name` attribute indicates how to reference this component in the query arguments: `q.args.<name-attr>`.

You can see the API for [ui.spinbox](/docs/api/ui#spinbox) or check the interactive example in Tour app.

## Basic spinbox

```py
q.page['example'] = ui.form_card(box='1 1 2 2', items=[
    ui.spinbox(name='spinbox', label='Spinbox')
])
```

## Default attribute values

| Attribute | Value |
|-----------|-------|
| min       | 0     |
| max       | 100   |
| step      | 1     |
| value     | 0     |

## Setting initial values

Use the `value` attribute to control the preselected state of the spinbox.

```py
q.page['example'] = ui.form_card(box='1 1 2 2', items=[
    ui.spinbox(name='spinbox', label='Spinbox', value=30)
])
```

## Disabled spinbox

Use the `disabled` attribute to indicate that the spinbox is read-only or not actionable yet (e.g.
waiting for a user to fill in other form items).

```py
q.page['example'] = ui.form_card(box='1 1 2 2', items=[
    ui.spinbox(name='spinbox', label='Spinbox', disabled=True)
])
```
