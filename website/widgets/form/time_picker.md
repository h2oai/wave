---
title: Time Picker
keywords:
  - form
  - time-picker
custom_edit_url: null
---

Use this component when you wish to collect time values. A return value is in `hh:mm` 24 hour cycle format.

The `name` attribute indicates how to reference this component in the query arguments: `q.args.<name-attr>`.

You can see the API for [ui.time_picker](/docs/api/ui#time_picker) or check the interactive example in Tour app.

## Basic time picker

```py
q.page['example'] = ui.form_card(box='1 1 2 2', items=[
    ui.time_picker(name='time_picker', label='Time picker')
])
```

## Setting initial values

Use the `value` attribute to control the preselected state of the time picker.

```py
q.page['example'] = ui.form_card(box='1 1 2 2', items=[
    ui.time_picker(name='time_picker', label='Time picker', value='01:30')
])
```

## Disabled time picker

Use the `disabled` attribute to indicate that the time_picker is read-only or not actionable yet (e.g.
waiting for a user to fill in other form items).

```py
q.page['example'] = ui.form_card(box='1 1 2 2', items=[
    ui.time_picker(name='time_picker', label='Time picker', disabled=True)
])
```

## Required time picker

Renders a small asterisk next to the label. Used for cases when the input has to be provided,
otherwise, the form is considered invalid.

```py
q.page['example'] = ui.form_card(box='1 1 2 2', items=[
    ui.time_picker(name='time_picker', label='Time picker', required=True)
])
```

## With time format

Property `hour_format` specifies whether the time picker should use 12 hour (default) or 24 hour time format. Possible options are `12` and `24`.

```py
q.page['example'] = ui.form_card(box='1 1 2 2', items=[
    ui.time_picker(name='time_picker', label='Time picker', hour_format='24')
])
```

## With boundaries

The minimum and/or maximum allowed time value in `hh:mm` format.

```py
q.page['example'] = ui.form_card(box='1 1 2 2', items=[
    ui.time_picker(name='time_picker', label='Time picker', min='10:00', max='18:00')
])
```

## With minutes step

If you wish to limit the available minutes to select from, use `minutes_step` property. Available values are `1`, `5`, `10`, `15`, `20`, `30` or `60` where `1` is the default.

```py
q.page['example'] = ui.form_card(box='1 1 2 2', items=[
    ui.time_picker(name='time_picker', label='Time picker', minutes_step=10)
])
```
