---
title: Dropdown 
keywords:
  - form
  - dropdown
custom_edit_url: null
---

 A dropdown is a list in which the selected item is always visible and others are visible on demand by clicking a drop-down button. They are used to simplify the design and make a choice within the UI.
 When closed, only the selected item is visible. All the options become visible once users click the drop-down button.

 To change the value, users open the list and click another value or use the arrow keys (up and down) to
 select a new value.

```py
q.page['example'] = ui.form_card(box='1 1 2 2', items=[
    ui.dropdown(name='dropdown', label='Dropdown', choices=[
        ui.choice(name='choice1', label='Choice 1'),
        ui.choice(name='choice2', label='Choice 2'),
        ui.choice(name='choice3', label='Choice 3'),
    ])
])
```

You can see the API for [ui.dropdown](/docs/api/ui#dropdown) or check the interactive example in Tour app.

## Default value

Use either the `value` parameter or the `values` parameter. Setting the `values` parameter
renders a multi-select dropdown.

```py
q.page['example'] = ui.form_card(box='1 1 2 2', items=[
    ui.dropdown(name='dropdown', label='Dropdown', value='choice1', choices=[
        ui.choice(name='choice1', label='Choice 1'),
        ui.choice(name='choice2', label='Choice 2'),
        ui.choice(name='choice3', label='Choice 3'),
    ])
])
```

## Required

Use `required` attribute to render a small asterisk next to label indicating this dropdown needs
to have a value filled in otherwise the form is considered invalid. Note that validation logic needs
to be handled by developer.

```py
q.page['example'] = ui.form_card(box='1 1 2 2', items=[
    ui.dropdown(name='dropdown', label='Dropdown', required=True, choices=[
        ui.choice(name='choice1', label='Choice 1'),
        ui.choice(name='choice2', label='Choice 2'),
        ui.choice(name='choice3', label='Choice 3'),
    ])
])
```

## Placeholder

A string rendered until a value is picked and provides hint on what kind of information is expected
to be filled in. However, don't mix it with `label`. For example label could be `Name` and
placeholder `John Doe`. It might be tempting to omit label and use placeholder instead, but that
is considered a UX anti-pattern.

```py
q.page['example'] = ui.form_card(box='1 1 2 2', items=[
    ui.dropdown(name='dropdown', label='Dropdown', placeholder='Choice 1', choices=[
        ui.choice(name='choice1', label='Choice 1'),
        ui.choice(name='choice2', label='Choice 2'),
        ui.choice(name='choice3', label='Choice 3'),
    ])
])
```

## Disabled

Use disabled attribute to indicate that the dropdown is read-only or not actionable yet (e.g.
waiting for user to fill in other form items).

```py
q.page['example'] = ui.form_card(box='1 1 2 2', items=[
    ui.dropdown(name='dropdown', label='Dropdown', disabled=True, choices=[
        ui.choice(name='choice1', label='Choice 1'),
        ui.choice(name='choice2', label='Choice 2'),
        ui.choice(name='choice3', label='Choice 3'),
    ])
])
```
