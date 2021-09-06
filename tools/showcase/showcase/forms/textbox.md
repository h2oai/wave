---
title: Textbox
keywords:
  - form
  - textbox
custom_edit_url: null
---

Used for capturing textual input from users. Make sure not to omit `label` so that users
know what they are expected to type. Another common UX error is misusing `placeholder` to serve as
a label which is not correct as the placeholder value should be an example value, e.g. for name field
the placeholder could be `John Doe`.

Note that if `trigger` is specified, the inputs are submitted after `500ms` of no typing activity. This
treshold is currently not configurable.

## Standard textbox

Regular textbox. `name` indicates the name of the `q.args` to be filled.

```py
q.page['example'] = ui.form_card(
    box='1 1 2 2',
    items=[ui.textbox(name='textbox', label='Standard')]
)
```

## Default value

Use `value` attribute when you want to prepopulate the textbox content.

```py
q.page['example'] = ui.form_card(
    box='1 1 2 2',
    items=[ui.textbox(name='textbox_default', label='Default value', value='Default value')]
)
```

## Disabled

Used for cases when the input should not be changable yet (e.g. waiting for filling some other form element first).

```py
q.page['example'] = ui.form_card(
    box='1 1 2 2',
    items=[ui.textbox(name='textbox_disabled', label='Disabled', disabled=True)]
)
```

## Required

Renders a small asterisk next to the label. Used for cases when the input has to be provided,
otherwise the form is considered invalid.

```py
q.page['example'] = ui.form_card(
    box='1 1 2 2',
    items=[ui.textbox(name='textbox_required', label='Required', required=True)]
)
```

## Readonly textbox

Best used for scenarios when you just want to show a value to the user, but don't want to make it
changable.

```py
q.page['example'] = ui.form_card(
    box='1 1 2 2',
    items=[ui.textbox(name='textbox_readonly', label='Read-only', readonly=True)]
)
```

## Error textbox

Used for validation results. Also make sure to not use generic error messages like `An error occured`.
Make sure the error messages are clear and user will know what to change in order to make validation
pass.

```py
q.page['example'] = ui.form_card(
    box='1 1 2 2',
    items=[ui.textbox(name='textbox_error', label='With error', error='I have an error')]
)
```

## Mask textbox

Need to force user to type in a specific format? No worries, we've got you covered! All you need
to do is use `mask` attr with your desired format.

```py
q.page['example'] = ui.form_card(
    box='1 1 2 2',
    items=[ui.textbox(name='textbox_mask', label='With input mask', mask='(999) 999 - 9999')]
)
```

## Prefix / Suffix

Is user inputting measurements in a known unit? Display the suffix / prefix so that he is absolutely
clear on what he is inputting.

```py
q.page['example'] = ui.form_card(
    box='1 1 2 2',
    items=[
        ui.textbox(name='textbox_prefix', label='With prefix', prefix='http://'),
        ui.textbox(name='textbox_suffix', label='With suffix', suffix='cm'),
    ]
)
```

## Multiline

If you expect users to type in longer text that would hardly fit into a small textbox, use
`multiline` attribute which transforms your textbox into a textarea.

```py
q.page['example'] = ui.form_card(
    box='1 1 2 2',
    items=[ui.textbox(name='textbox_multiline', label='Multiline textarea', multiline=True)]
)
```
