---
title: Menu
keywords:
  - form
  - menu
custom_edit_url: null
---

Create a contextual menu component. Useful when you have a lot of links and want to conserve the space.

Check the full API at [ui.menu](/docs/api/ui#menu).

## Basic menu

```py
q.page['form'] = ui.form_card(
    box='1 1 2 2',
    items=[
        ui.menu(items=[
            ui.command(name='profile', label='Profile', icon='Contact'),
            ui.command(name='preferences', label='Preferences', icon='Settings'),
            ui.command(name='logout', label='Logout', icon='SignOut'),
        ])
    ]
)
```

## With image

Use the `image` attribute when you want to inline an image (preferably a user avatar) with the context menu.

```py
q.page['form'] = ui.form_card(
    box='1 1 2 2',
    items=[
        ui.menu(
            image='https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&h=750&w=1260',
            items=[
                ui.command(name='profile', label='Profile', icon='Contact'),
                ui.command(name='preferences', label='Preferences', icon='Settings'),
                ui.command(name='logout', label='Logout', icon='SignOut'),
            ])
    ]
)
```

## With icon

Use the `icon` attribute when you want to inline an icon.

```py
q.page['form'] = ui.form_card(
    box='1 1 2 2',
    items=[
        ui.menu(
            icon='Heart',
            items=[
                ui.command(name='profile', label='Profile', icon='Contact'),
                ui.command(name='preferences', label='Preferences', icon='Settings'),
                ui.command(name='logout', label='Logout', icon='SignOut'),
            ])
    ]
)
```

## With label

Use the `label` attribute when you want to inline a menu label.

```py
q.page['form'] = ui.form_card(
    box='1 1 2 2',
    items=[
        ui.menu(
            label='App',
            items=[
                ui.command(name='profile', label='Profile', icon='Contact'),
                ui.command(name='preferences', label='Preferences', icon='Settings'),
                ui.command(name='logout', label='Logout', icon='SignOut'),
            ])
    ]
)
```
