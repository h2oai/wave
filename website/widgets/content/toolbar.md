---
title: Toolbar
keywords:
  - toolbar
custom_edit_url: null
---

Use toolbars to provide commands that operate on the content of a page.

```py
q.page['example'] = ui.toolbar_card(
    box='1 1 4 1',
    items=[
        ui.command(
            name='new', label='New', icon='Add', items=[
                ui.command(name='email', label='Email Message', icon='Mail'),
                ui.command(name='calendar', label='Calendar Event', icon='Calendar'),
            ]
        ),
        ui.command(name='upload', label='Upload', icon='Upload'),
        ui.command(name='share', label='Share', icon='Share'),
        ui.command(name='download', label='Download', icon='Download', path='https://wave.h2o.ai/img/logo.svg', download=True),
    ],
    secondary_items=[
        ui.command(name='tile', caption='Grid View', icon='Tiles'),
        ui.command(name='info', caption='Info', icon='Info', path='https://wave.h2o.ai'),
    ],
    overflow_items=[
        ui.command(name='move', label='Move to...', icon='MoveToFolder'),
        ui.command(name='copy', label='Copy to...', icon='Copy'),
        ui.command(name='rename', label='Rename', icon='Edit'),
    ],
)
```
