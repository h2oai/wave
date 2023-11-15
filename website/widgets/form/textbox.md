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

Note that if `trigger` is specified, the inputs are submitted after `500ms` of no typing activity. This threshold is currently not configurable.

The `name` attribute indicates how to reference this component in the query arguments: `q.args.<name-attr>`.

You can see the API for [ui.textbox](/docs/api/ui#textbox) or check the interactive example in Tour app.

## Basic textbox

```py
q.page['example'] = ui.form_card(
    box='1 1 2 2',
    items=[ui.textbox(name='textbox', label='Standard')]
)
```

## Setting initial values

Use the `value` attribute when you want to prepopulate the textbox content.

```py
q.page['example'] = ui.form_card(
    box='1 1 2 2',
    items=[ui.textbox(name='textbox_default', label='Default value', 
                      value='Default value')]
)
```

## Disabled textbox

Used for cases when the input should not be changeable yet (e.g. waiting for filling some other form element first).

```py
q.page['example'] = ui.form_card(
    box='1 1 2 2',
    items=[ui.textbox(name='textbox_disabled', label='Disabled', disabled=True)]
)
```

## Required textbox

Renders a small asterisk next to the label. Used for cases when the input has to be provided,
otherwise, the form is considered invalid.

```py
q.page['example'] = ui.form_card(
    box='1 1 2 2',
    items=[ui.textbox(name='textbox_required', label='Required', required=True)]
)
```

## Readonly textbox

Best used for scenarios when you just want to show a value to the user, but don't want to make it changeable.

```py
q.page['example'] = ui.form_card(
    box='1 1 2 2',
    items=[ui.textbox(name='textbox_readonly', label='Read-only', readonly=True)]
)
```

## With error

Used for validation results. Make sure to not use generic error messages like `An error occurred`.
Make sure the error messages are clear and the user will know what to change to make validation
pass.

```py
q.page['example'] = ui.form_card(
    box='1 1 2 2',
    items=[ui.textbox(name='textbox_error', label='With error', error='I have an error')]
)
```

## With mask

Need to force the users to type in a specific format? No worries, we've got you covered! All you need
to do is use `mask` attr with your desired format.

```py
q.page['example'] = ui.form_card(
    box='1 1 2 2',
    items=[ui.textbox(name='textbox_mask', label='With input mask', 
                      mask='(999) 999 - 9999')]
)
```

## With prefix/suffix

Is the user inputting measurements in a known unit? Display the suffix/prefix so that he is absolutely
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

## Multiline textbox

If you expect users to type in a longer text that would hardly fit into a small textbox, use
`multiline` attribute which transforms your textbox into a textarea.

```py
q.page['example'] = ui.form_card(
    box='1 1 2 2',
    items=[ui.textbox(name='textbox_multiline', label='Multiline textarea', 
                      multiline=True)]
)
```

## With spellcheck

Used for cases when the input should not check the word spelling (e.g. for inputting names or config parameters).

```py
q.page['example'] = ui.form_card(
    box='1 1 2 2',
    items=[ui.textbox(name='textbox_spellcheck_disabled', label='Spellcheck disabled', 
                      value="I have spellcheck disabld", spellcheck=False)]
)
```

## Mobile keyboard layout

Show proper keyboard layout on mobile devices with `keyboard` attribute. Defaults to `text`.
This does not prevent user from typing any character. If you want to allow typing e.g. numeric characters only, use in combination with [mask](#with-mask).

```py
q.page['example'] = ui.form_card(
    box='1 1 2 2',
    items=[
        ui.textbox(
            name='textbox_keyboard_numeric', 
            label='With numeric keyboard (iOS, Android)',
            # Show numeric keyboard
            keyboard='number'
            ),
        ui.textbox(
            name='textbox_keyboard_telephone', 
            label='With numeric keyboard (iOS, Android)',
            # Show telephone keyboard
            keyboard='tel'
            )
        ]
)
```
