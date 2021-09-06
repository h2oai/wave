---
title: Picker
keywords:
  - form
  - picker
custom_edit_url: null
---

Pickers are used to select one or more choices, such as tags, from a list.
Use a picker to allow the user to quickly search for or manage a few tags.

```py
q.page['example'] = ui.form_card(box='1 1 2 2', items=[
    ui.picker(name='picker', label='Picker', choices=[
        ui.choice(name='spam', label='Spam'),
        ui.choice(name='eggs', label='Eggs'),
        ui.choice(name='ham', label='Ham'),
    ]),
])
```

## Preselection

Use `values` attribute to preselect certain tags.

```py
q.page['example'] = ui.form_card(box='1 1 2 2', items=[
    ui.picker(name='picker', label='Picker', values=['eggs'], choices=[
        ui.choice(name='spam', label='Spam'),
        ui.choice(name='eggs', label='Eggs'),
        ui.choice(name='ham', label='Ham'),
    ]),
])
```

## Limit selection

Wave also makes it possible to limit the number of choices a user might pick via `max_choices` attribute.

```py
q.page['example'] = ui.form_card(box='1 1 2 2', items=[
    ui.picker(name='picker', label='Picker', max_choices=2, choices=[
        ui.choice(name='spam', label='Spam'),
        ui.choice(name='eggs', label='Eggs'),
        ui.choice(name='ham', label='Ham'),
    ]),
])
```

## Disabled

Used for cases when the picker should not be changable yet (e.g. waiting for filling some other
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

## Required

Renders a small asterisk next to the label. Used for cases when the input has to be provided,
otherwise the form is considered invalid.

```py
q.page['example'] = ui.form_card(box='1 1 2 2', items=[
    ui.picker(name='picker', label='Picker', required=True, choices=[
        ui.choice(name='spam', label='Spam'),
        ui.choice(name='eggs', label='Eggs'),
        ui.choice(name='ham', label='Ham'),
    ]),
])
```
