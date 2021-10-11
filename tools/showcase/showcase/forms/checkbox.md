---
title: Checkbox
keywords:
  - form
  - checkbox
custom_edit_url: null
---

Use checkboxes when you need to switch between 2 mutually exclusive options.

```py
q.page['example'] = ui.form_card(
    box='1 1 2 2',
    items=[ui.checkbox(name='checkbox', label='Standard')]
)
```

The `name` attribute indicates how to reference this component in the query arguments: `q.args.<name-attr>`. 

You can see the API for [ui.checkbox](/docs/api/ui#checkbox) or check the interactive example in Tour app.

## Default value

Use `value` attribute when you want to prepopulate the checkbox content.

```py
q.page['example'] = ui.form_card(
    box='1 1 2 2',
    items=[ui.checkbox(name='checkbox_default', label='Default value', value=True)]
)
```

If the value is neither `true` nor `false`, you can set `indeterminate` attr.

```py
q.page['example'] = ui.form_card(
    box='1 1 2 2',
    items=[ui.checkbox(name='checkbox_default', label='Default value', indeterminate=True)]
)
```

## Disabled checkbox

Used for cases when the checkbox should not be changable yet (e.g. waiting for filling some other form element first)
or serves as read-only information.

```py
q.page['example'] = ui.form_card(
    box='1 1 2 2',
    items=[ui.checkbox(name='checkbox_disabled', label='Disabled', disabled=True)]
)
```
