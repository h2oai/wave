---
title: Toggle
keywords:
  - form
  - toggle
custom_edit_url: null
---

Similar to [checkbox](/docs/showcase/forms/checkbox), this control is used when your user
needs to make a decision between 2 mutually exclusive options (like toggling something on
or off). The difference is that toggles should be used when user expects instant change, e.g.
app theme change. In other words, use them for actions that take immediate effect. Checkboxes
on the other hand usually require a submit button press, e.g. filling a form.

```py
q.page['example'] = ui.form_card(box='1 1 2 2', items=[
    ui.toggle(name='toggle', label='Toggle'),
])
```

## Default value

As most of the components, toggle also uses `value` attribute to determine the initial
component state.

```py
q.page['example'] = ui.form_card(box='1 1 2 2', items=[
    ui.toggle(name='toggle', label='Toggle', value=True),
])
```

## Disabled

Used for cases when the toggle should not be changable yet (e.g. waiting for filling some
other form element first) or serves as read-only information.

```py
q.page['example'] = ui.form_card(box='1 1 2 2', items=[
    ui.toggle(name='toggle', label='Toggle', disabled=True),
])
```
