---
title: Groups
keywords:
  - form
custom_edit_url: null
---

Grouping form items that go together contextually is usually a good idea as it helps user to understand
why you are asking for that data and what belongs together.

## Separator

The simplest way to group related fields is to use [ui.separator](/docs/api/ui#separator) which visually divides form into subsections.

```py
q.page['example'] = ui.form_card(
    box='1 1 2 4',
    items=[
        ui.separator(label='Separator 1'),
        ui.text('The quick brown fox jumps over the lazy dog.'),
        ui.separator(label='Separator 2'),
        ui.text('The quick brown fox jumps over the lazy dog.'),
        ui.separator(label='Separator 3'),
        ui.text('The quick brown fox jumps over the lazy dog.'),
    ]
)
```

## Inline

By default, all form items are laid out vertically (top to bottom). For more complex forms though, this might not be enough and
that's where [ui.inline](/docs/api/ui#inline) comes into play. All you need to do is specify the `items` attribute, which accepts any form
component. Optionally, you can also specify `justify` if you want to control the alignment too.

```py
q.page['form'] = ui.form_card(
    box='1 1 4 2',
    items=[ui.inline(items=[
        ui.textbox(name='textbox1', label='Textbox 1'),
        ui.textbox(name='textbox2', label='Textbox 2'),
        ui.textbox(name='textbox3', label='Textbox 3'),
    ])],
)
```

## Expander

If you need to group related content and allow user to hide / show it on demand, use [ui.expander](/docs/api/ui#expander). It can be useful for cases
when there is a lot of form elements and the screen is cramped.

```py
q.page['form'] = ui.form_card(
    box='1 1 2 4',
    items=[ui.expander(name='expander', label='Expander example', items=[
        ui.textbox(name='textbox1', label='Textbox 1'),
        ui.textbox(name='textbox2', label='Textbox 2'),
        ui.textbox(name='textbox3', label='Textbox 3'),
    ])],
)
```

:::tip
Use `expanded` attr to toggle between collapsed / expanded state.
:::

```py
q.page['form'] = ui.form_card(
    box='1 1 2 4',
    items=[ui.expander(name='expander', label='Expander example', expanded=True, items=[
        ui.textbox(name='textbox1', label='Textbox 1'),
        ui.textbox(name='textbox2', label='Textbox 2'),
        ui.textbox(name='textbox3', label='Textbox 3'),
    ])],
)
```

## Stepper

Another alternative to [ui.expander](/docs/api/ui#expander) can be a simple stepper. If you feel like a multi-step form could make more sense than a
single cramped form, make sure user is well aware of what the current step is about. The data collected should be grouped contextually, with a group name
used as a step label.

```py
q.page['form'] = ui.form_card(
    box='1 1 4 2',
    items=[
        ui.stepper(name='stepper', items=[
            ui.step(label='Order info', done=True),
            ui.step(label='Personal info', icon='ContactCard'),
            ui.step(label='Payment info', icon='Money'),
        ])
    ]
)
```

:::tip
Also don't forget that your multi step form should have easy navigation back and forth between steps and should accomodate data validation prior to proceeding to the next step.
That means `Next` button should be disabled until all the required fields are filled correctly.
:::
