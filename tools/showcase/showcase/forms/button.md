---
title: Button
keywords:
  - form
  - buttons
custom_edit_url: null
---

Use buttons to handle user interactions in forms that should result in app view changes, task completions or routing.
Also think about the correct button state, type and even cosmetic things like icons.

```py
q.page['form'] = ui.form_card(box='1 1 1 1', items=[
    ui.button(name='button', label='Button')
])
```

You can see the API for [ui.button](/docs/api/ui#button) or check the interactive example in Tour app.

## Primary

Use primary button to indicate what should the most critical action in a form be in order to let user continue the app flow you prepared.
Also note that there should always be at most one primary button shown on a page as it indicates higher priority for a click. If there is
a need for multiple buttons with the same priority, better make none of them primary and go with regular ones.

```py
q.page['form'] = ui.form_card(box='1 1 1 1', items=[
    ui.button(name='button', label='Button', primary=True)
])
```

## Disabled

Use disabled button for cases when clicking should not be allowed, based on current app state. A typical example might be a user didn't fill all the form fields yet
so is not allowed to proceed. Disabled buttons have all interactions disabled (click, hover etc.).

```py
q.page['form'] = ui.form_card(box='1 1 1 1', items=[
    ui.button(name='button', label='Button', disabled=True)
])
```

## Text

The best thing to do when picking a button text is to keep it concise and clear on what the button is going to do. Preferably a single word.
However, there might be cases, where an extra description can be of help. Using `caption` attr adds secondary text to a button.

```py
q.page['form'] = ui.form_card(box='1 1 2 2', items=[
    ui.button(name='button', label='Button', caption='Extra description here')
])
```

## Icons

In order to reinforce the information a button holds, an [icon](https://uifabricicons.azurewebsites.net/) can be used.

```py
q.page['form'] = ui.form_card(box='1 1 2 1', items=[
    ui.button(name='button', label='Button', icon='Heart')
])
```

For cases when button doesn't need text and a single icon is sufficient, don't specify `label` attr. It is highly
recommended to include `caption` for a tooltip with extra info.

```py
q.page['form'] = ui.form_card(box='1 1 1 1', items=[
    ui.button(name='button', icon='Heart', caption='Tooltip on hover')
])
```

## Data binding

By default, clicking a button results in submitting `q.args.<button-name-attr>` with a value of `True`. This, however, might not suit all the cases.
Use `value` attr if bool is not sufficient.

## Positioning

Buttons on its own can only be placed in a [form_card](/docs/api/ui#form_card), either vertically or horizontally.
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
