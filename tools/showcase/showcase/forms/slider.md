---
title: Slider 
keywords:
  - form
  - slider
custom_edit_url: null
---

A slider is an element used to set a value. It provides a visual indication of adjustable content,
as well as the current setting in the total range of content. It is displayed as a horizontal track
with options on either side.

A knob or lever is dragged to one end or the other to make the choice, indicating the current value.
Marks on the slider bar can show values and users can choose where they want to drag the knob or
lever to set the value.

A slider is a good choice when you know that users think of the value as a relative quantity,
not a numeric value. For example, users think about setting their audio volume to low or medium —
not about setting the value to two or five.

The default value of the slider will be zero or be constrained to the `min` and `max` values.
The `min` will be returned if the value is set under the `min` and the `max` will be returned if set
higher than the `max` value.

```py
q.page['example'] = ui.form_card(box='1 1 2 2', items=[
    ui.slider(name='slider', label='Slider')
])
```

## Default attribute values

| Attribute   | value   |
|-------------|---------|
| min         | 0       |
| max         | 100     |
| step        | 1       |
| value       | 0       |


## Default value

Use `value` attribute in order to control preselected state of the slider.

```py
q.page['example'] = ui.form_card(box='1 1 2 2', items=[
    ui.slider(name='slider', label='Slider', value=30)
])
```

## Disabled

Use `disabled` attribute to indicate that the slider is read-only or not actionable yet (e.g.
waiting for user to fill in other form items).

```py
q.page['example'] = ui.form_card(box='1 1 2 2', items=[
    ui.slider(name='slider', label='Slider', disabled=True)
])
```
