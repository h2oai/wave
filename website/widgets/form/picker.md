---
title: Picker
keywords:
  - form
  - picker
custom_edit_url: null
---

Pickers are used to select one or more choices, such as tags, from a list.
Use a picker to allow the user to quickly search for or manage a few tags.

The `name` attribute indicates how to reference this component in the query arguments: `q.args.<name-attr>`.

You can see the API for [ui.picker](/docs/api/ui#picker) or check the interactive example in Tour app.

## Basic picker

```py
q.page['example'] = ui.form_card(box='1 1 2 2', items=[
    ui.picker(name='picker', label='Picker', choices=[
        ui.choice(name='spam', label='Spam'),
        ui.choice(name='eggs', label='Eggs'),
        ui.choice(name='ham', label='Ham'),
    ]),
])
```

## With preselection

Use the `values` attribute to preselect certain tags.

```py
q.page['example'] = ui.form_card(box='1 1 2 2', items=[
    ui.picker(name='picker', label='Picker', values=['eggs'], choices=[
        ui.choice(name='spam', label='Spam'),
        ui.choice(name='eggs', label='Eggs'),
        ui.choice(name='ham', label='Ham'),
    ]),
])
```

## With a limited selection

Wave also makes it possible to limit the number of choices a user might pick via the `max_choices` attribute.

```py
q.page['example'] = ui.form_card(box='1 1 2 2', items=[
    ui.picker(name='picker', label='Picker', max_choices=2, choices=[
        ui.choice(name='spam', label='Spam'),
        ui.choice(name='eggs', label='Eggs'),
        ui.choice(name='ham', label='Ham'),
    ]),
])
```

## Disabled picker

Used for cases when the picker should not be changeable yet (e.g. waiting for filling some other
form element first) or should serve as a read-only element.

```py
q.page['example'] = ui.form_card(box='1 1 2 2', items=[
    ui.picker(name='picker', label='Picker', disabled=True, choices=[
        ui.choice(name='spam', label='Spam'),
        ui.choice(name='eggs', label='Eggs'),
        ui.choice(name='ham', label='Ham'),
    ]),
])
```

## Required picker

Renders a small asterisk next to the label. Used for cases when the input has to be provided,
otherwise, the form is considered invalid.

```py
q.page['example'] = ui.form_card(box='1 1 2 2', items=[
    ui.picker(name='picker', label='Picker', required=True, choices=[
        ui.choice(name='spam', label='Spam'),
        ui.choice(name='eggs', label='Eggs'),
        ui.choice(name='ham', label='Ham'),
    ]),
])
```
