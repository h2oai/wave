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
which is out of boundaries (min / max), the appropriate boundary value will be used instead.

Note that if `trigger` is specified, the inputs are submitted after `500ms` of no typing activity. This
treshold is currently not configurable.

The defaults:
| Attribute   | value   |
|-------------|---------|
| min         | 0       |
| max         | 100     |
| step        | 1       |
| value       | 0       |

```py
q.page['example'] = ui.form_card(box='1 1 2 2', items=[
    ui.spinbox(name='spinbox', label='Spinbox')
])
```

## Default value

Use `value` attribute in order to control preselected state of the spinbox.

```py
q.page['example'] = ui.form_card(box='1 1 2 2', items=[
    ui.spinbox(name='spinbox', label='Spinbox', value=30)
])
```

## Disabled

Use `disabled` attribute to indicate that the spinbox is read-only or not actionable yet (e.g.
waiting for user to fill in other form items).

```py
q.page['example'] = ui.form_card(box='1 1 2 2', items=[
    ui.spinbox(name='spinbox', label='Spinbox', disabled=True)
])
```
