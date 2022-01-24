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
other to make the choice, indicating the current `max` and `min` values.

The obvious difference between [ui.slider](/docs/api/ui#slider) is that range slider allows you to
pick interval (range) of values between `min` and `max` instead of a single value.

The `name` attribute indicates how to reference this component in the query arguments: `q.args.<name-attr>`.

You can see the API for [ui.range_slider](/docs/api/ui#range_slider) or check the interactive example in Tour app.

## Default attribute values

| Attribute   | value   |
|-------------|---------|
| min         | 0       |
| max         | 100     |
| step        | 1       |

## Basic range slider

```py
q.page['example'] = ui.form_card(box='1 1 2 2', items=[
    ui.range_slider(name='range_slider', label='Range slider')
])
```

## Setting initial values

Use `min_value` and `max_value` attributes to control the preselected state of the range slider.

```py
q.page['example'] = ui.form_card(box='1 1 2 2', items=[
    ui.range_slider(name='range_slider', label='Range slider', min_value=10, max_value=20)
])
```

## Disabled range slider

Use the `disabled` attribute to indicate that the slider is read-only or not actionable yet (e.g.
waiting for a user to fill in other form items).

```py
q.page['example'] = ui.form_card(box='1 1 2 2', items=[
    ui.range_slider(name='range_slider', label='Range slider', disabled=True)
])
```
