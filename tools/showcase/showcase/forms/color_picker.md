---
title: Color Picker
keywords:
  - form
  - color-picker
custom_edit_url: null
---

Use this component when you wish to collect color values.

```py
q.page['example'] = ui.form_card(box='1 1 2 2', items=[
    ui.color_picker(name='color_picker', label='Color picker')
])
```

## Default value

Use `value` attribute in order to control preselected state of the color picker.

```py
q.page['example'] = ui.form_card(box='1 1 2 2', items=[
    ui.color_picker(name='color_picker', label='Color picker', value='#FBE52B')
])
```

## Swatch

If the 'choices' parameter is set, a swatch picker is displayed instead of the standard color picker.
This allows you to constrain the colors user is able to pick.

```py
q.page['example'] = ui.form_card(box='1 1 2 2', items=[
    ui.color_picker(name='swatch_picker', label='Swatch picker', choices=[
        '#011627', '#2EC4B6', '#E71D36', '#FF9F1C', '#50514F',
        '#F25F5C', '#FFE066', '#247BA0', '#70C1B3', '#FDFFFC'
    ])
])
```
