---
title: Button
keywords:
  - form
  - buttons
custom_edit_url: null
---

Use buttons to handle user interactions in forms that should result in app view changes, task completions or routing.
Also think about the correct button state, type and even cosmetic things like icons.

The `name` attribute indicates how to reference this component in the query arguments: `q.args.<name-attr>`.

You can see the API for [ui.button](/docs/api/ui#button) or check the interactive example in the Tour app.

## Basic button

```py
q.page['form'] = ui.form_card(box='1 1 1 1', items=[
    ui.button(name='button', label='Button')
])
```

## Primary button

Use a primary button to indicate the most critical action in a form to let the user continue the app flow you prepared.
Also, note that there should always be at most one primary button shown on a page as it indicates higher priority for a click. If there is
a need for multiple buttons with the same priority, it's better to make none of them primary and go with regular buttons.

```py
q.page['form'] = ui.form_card(box='1 1 1 1', items=[
    ui.button(name='button', label='Button', primary=True)
])
```

## With description

The best thing to do when picking a button text is to keep it concise and clear on what the button is going to do. Preferably a single word.
However, there might be cases, where an extra description can be of help. Using the `caption` attribute adds secondary text to a button.

```py
q.page['form'] = ui.form_card(box='1 1 2 2', items=[
    ui.button(name='button', label='Button', caption='Extra description here')
])
```

## With icon

To reinforce the information a button holds, an [icon](/docs/icons) can be used.

```py
q.page['form'] = ui.form_card(box='1 1 2 1', items=[
    ui.button(name='button', label='Button', icon='Heart')
])
```

For cases when the button doesn't need text and a single icon is sufficient, don't specify `label` attr. It is highly
recommended to include `caption` for a tooltip with extra info.

```py
q.page['form'] = ui.form_card(box='1 1 1 1', items=[
    ui.button(name='button', icon='Heart', caption='Tooltip on hover')
])
```

You can also use the icon only button as a [primary button](#primary-button).

```py
q.page['form'] = ui.form_card(box='1 1 1 1', items=[
    ui.button(name='button', icon='ChevronRight', caption='Tooltip on hover', primary=True)
])
```

## Button layout

Buttons on their own can only be placed in a [form_card](/docs/api/ui#form_card), either vertically or horizontally.
The default alignment is vertical and requires nothing special:

```py
q.page['form'] = ui.form_card(box='1 1 1 2', items=[
    ui.button(name='button', label='Button 1'),
    ui.button(name='button', label='Button 2')
])
```

On the other hand, horizontal alignment requires wrapping the buttons in [ui.buttons](/docs/api/ui#buttons) component:

```py
q.page['form'] = ui.form_card(box='1 1 3 1', items=[
    ui.buttons(justify='end', items=[
        ui.button(name='button', label='Button 1'),
        ui.button(name='button', label='Button 2')
    ])
])
```

Achieving this is also possible via [ui.inline](/docs/api/ui#inline), but is meant for form items in general. The recommended way for buttons is using
[ui.buttons](/docs/api/ui#buttons).

```py
q.page['form'] = ui.form_card(box='1 1 3 1', items=[
    ui.inline(justify='end', items=[
        ui.button(name='button', label='Button 1'),
        ui.button(name='button', label='Button 2')
    ])
])
```

## Disabled button

Use a disabled button for cases when clicking should not be allowed, based on the current app state. A typical example might be a user who didn't fill all the form fields yet
and is not allowed to proceed. Disabled buttons have all interactions disabled (click, hover etc.).

```py
q.page['form'] = ui.form_card(box='1 1 1 1', items=[
    ui.button(name='button', label='Button', disabled=True)
])
```

## With Value

By default, clicking a button results in submitting `q.args.<button-name-attr>` with a value of `True`. This, however, might not suit all the cases for example when a list is needed to be rendered and each list item button should lead to the item detail.

Use the `value` attribute to submit a specific value for `q.args.<button-name-attr>`.

```py
q.page['form'] = ui.form_card(
    box='1 1 1 2',
    items=[ui.button(name='button', label=f'Button {i+1}', value=str(i)) for i in range(3)]
)
```

## With path

Use a `path` attribute when you want your button to redirect to internal or external hyperlink.

- Internal hyperlinks have paths that begin with a `/` and point to URLs within the Wave UI
- All other kinds of paths are treated as external hyperlinks (e.g. <https://h2o.ai/>)

```py
q.page['form'] = ui.form_card(box='1 1 1 1', items=[
    ui.button(name='external_path_button', label='External', path='https://h2o.ai/')
])
```

## With actions

The `commands` attribute can provide other relevant actions for the button that are displayed inside of a context menu. See [ui.command API](/docs/api/ui#command) for available options.

```py
q.page['form'] = ui.form_card(box='1 1 2 1', items=[
    ui.button(name='command_button', label='Button with commands', commands=[
            ui.command(name='first_command', label='First command'),
            ui.command(name='other_commands', label='Other commands', items=[
                        ui.command(name='second_command', label='Second command'),
                        ui.command(name='third_command', label='Third command'),
                    ]),
    ])
])
```
