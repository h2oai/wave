---
title: Combobox
keywords:
  - form
  - combobox
custom_edit_url: null
---

 A combobox is a list in which the selected item is always visible, and others are visible on
 demand by clicking a drop-down button or by typing in the input. They are used to simplify the
 design and make a choice within the UI.

 When closed, only the selected item is visible. When users click the drop-down button, all the
 options become visible. To change the value, users open the list and click another value or use
 the arrow keys (up and down) to select a new value. When collapsed the user can select a new
 value by typing.

 Note that if `trigger` is specified, the inputs are submitted if the value changes and the user presses Enter
 or clicks out of the textbox. The value is also submitted upon dropdown option selection.

The `name` attribute indicates how to reference this component in the query arguments: `q.args.<name-attr>`.

You can see the API for [ui.combobox](/docs/api/ui#combobox) or check the interactive example in Tour app.

## Basic combobox

```py
q.page['example'] = ui.form_card(box='1 1 2 2', items=[
    ui.combobox(name='combobox', label='Combobox', choices=['Cyan', 'Magenta', 'Yellow', 'Black']),
])
```

## Setting initial values

Use the `value` attribute to control the preselected state of the combobox.

```py
q.page['example'] = ui.form_card(box='1 1 2 2', items=[
    ui.combobox(name='combobox', label='Combobox', value='Cyan',
        choices=['Cyan', 'Magenta', 'Yellow', 'Black']),
])
```

## With placeholder

A string that is rendered until a value is picked, provides a hint on what kind of information is expected
to be filled in. However, don't mix it with `label`. For example, the label could be `Name` and
the placeholder `John Doe`. It might be tempting to omit the label and use a placeholder instead, but that
is considered a UX anti-pattern.

```py
q.page['example'] = ui.form_card(box='1 1 2 2', items=[
    ui.combobox(name='combobox', label='Combobox', placeholder='e.g. Cyan',
        choices=['Cyan', 'Magenta', 'Yellow', 'Black']),
])
```

## Disabled combobox

Use disabled attribute to indicate that the combobox is read-only or not actionable yet (e.g.
waiting for a user to fill in other form items).

```py
q.page['example'] = ui.form_card(box='1 1 2 2', items=[
    ui.combobox(name='combobox', label='Combobox', disabled=True,
        choices=['Cyan', 'Magenta', 'Yellow', 'Black']),
])
```

## With error

Used for validation results. Make sure to not use generic error messages as `An error occurred`.
Make sure the error messages are clear and the user will know what to change to make validation
pass.

```py
q.page['example'] = ui.form_card(box='1 1 2 2', items=[
    ui.combobox(name='combobox', label='Combobox', error='Choose a valid color',
        choices=['Cyan', 'Magenta', 'Yellow', 'Black']),
])
```
