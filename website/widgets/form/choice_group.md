---
title: ChoiceGroup
keywords:
  - form
  - choice_group
custom_edit_url: null
---


 The choice group component, also known as radio buttons, lets users select one option from two or more choices.
 Each option is represented by one choice group button. A user can select only one choice group in a button group.

 Choice groups emphasize all options equally, and that may draw more attention to the options than necessary.
 Consider using other components, unless the options deserve extra attention from the user.
 For example, if the default option is recommended for most users in most situations, use a dropdown instead.

 If there are only two mutually exclusive options, combine them into a single [ui.checkbox](/docs/api/ui#checkbox) or [ui.toggle](/docs/api/ui#toggle) switch.
 For example, use a checkbox for "I agree" instead of choice group buttons for "I agree" and "I don't agree."

The `name` attribute indicates how to reference this component in the query arguments: `q.args.<name-attr>`.

You can see the API for [ui.choice_group](/docs/api/ui#choice_group) or check the interactive example in Tour app.

## Basic checkbox

```py
q.page['example'] = ui.form_card(box='1 1 2 2', items=[
    ui.choice_group(name='choice_group', label='Choice group', choices=[
        ui.choice('A', 'Option A'),
        ui.choice('B', 'Option B'),
        ui.choice('C', 'Option C'),
    ])
])
```

## Setting initial values

If you want to preselect an option, use the `value` attribute with the same value used for the choice `name` attribute.

```py
q.page['example'] = ui.form_card(box='1 1 2 2', items=[
    ui.choice_group(name='choice_group', label='Choice group', value='A', choices=[
        ui.choice('A', 'Selected A'),
        ui.choice('B', 'Option B'),
        ui.choice('C', 'Option C'),
    ])
])
```

## Horizontal layout

Choice group renders options vertically (top to bottom) by default, but if you feel like you have a lot of options and
plenty of wasted space, you can go for the `inline` attribute which renders choices horizontally (left to right). There's
also no need to worry about lines being too long as the choice group wraps choices automatically for you.

```py
q.page['example'] = ui.form_card(box='1 1 2 2', items=[
    ui.choice_group(name='choice_group', label='Choices', inline=True, choices=[
        ui.choice(name='choice1', label='Choice 1'),
        ui.choice(name='choice2', label='Choice 2'),
        ui.choice(name='choice3', label='Choice 3'),
        ui.choice(name='choice4', label='Choice 4'),
    ])
])
```

## Disabled

Wave also provides an option to render a choice as disabled for cases when you don't want your users
to manipulate the choice yet or just want to make it read-only.

```py
q.page['example'] = ui.form_card(box='1 1 2 2', items=[
    ui.choice_group(name='choice_group', label='Choice group', choices=[
        ui.choice('A', 'Option A'),
        ui.choice('B', 'Disabled B', disabled=True),
        ui.choice('C', 'Option C'),
    ])
])
```
