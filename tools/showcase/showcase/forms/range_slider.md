---
title: Range slider 
keywords:
  - form
  - range-slider
custom_edit_url: null
---

A range slider is an element used to select a value range. It provides a visual indication of
adjustable content, as well as the current setting in the total range of content. It is displayed
as a horizontal track with options on either side. Knobs or levers are dragged to one end or the
other to make the choice, indicating the current `max` and `min` value.

The obvious difference between [ui.slider](/docs/api/ui#slider) is that range slider allows you to
pick interval (range) of values between `min` and `max` instead of a single value.

The defaults:
| Attribute   | value   |
|-------------|---------|
| min         | 0       |
| max         | 100     |
| step        | 1       |

```py
q.page['example'] = ui.form_card(box='1 1 2 2', items=[
    ui.range_slider(name='range_slider', label='Range slider')
])
```

## Default value

Use `min_value` and `max_value` attributes in order to control preselected state of the range slider.

```py
q.page['example'] = ui.form_card(box='1 1 2 2', items=[
    ui.range_slider(name='range_slider', label='Range slider', min_value=10, max_value=20)
])
```

## Disabled

Use `disabled` attribute to indicate that the slider is read-only or not actionable yet (e.g.
waiting for user to fill in other form items).

```py
q.page['example'] = ui.form_card(box='1 1 2 2', items=[
    ui.range_slider(name='range_slider', label='Range slider', disabled=True)
])
```
