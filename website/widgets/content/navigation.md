---
title: Navigation
keywords:
  -  nav
custom_edit_url: null
---

If the app content is taller than wider, it might be a good idea to save a bit of vertical space and use side bar navigation instead of the top navigation. Note that the most complex apps may need to use both.

Check the full API at [ui.nav_card](/docs/api/ui#nav_card).

## Basic nav

```py
q.page['nav'] = ui.nav_card(
    box='1 1 2 6',
    items=[
        ui.nav_group('Menu', items=[
            ui.nav_item(name='#menu/spam', label='Spam'),
            ui.nav_item(name='#menu/ham', label='Ham'),
            ui.nav_item(name='#menu/eggs', label='Eggs'),
            ui.nav_item(name='#menu/toast', label='Toast', disabled=True),
        ]),
        ui.nav_group('Help', items=[
            ui.nav_item(name='#about', label='About', icon='Info'),
            ui.nav_item(name='#support', label='Support', icon='Help'),
        ])
    ]
)
```

## With image

```py
q.page['nav'] = ui.nav_card(
    box='1 1 2 8',
    title='H2O Wave',
    subtitle='And now for something completely different!',
    image='https://wave.h2o.ai/img/h2o-logo.svg',
    items=[
        ui.nav_group('Menu', items=[
            ui.nav_item(name='#menu/spam', label='Spam'),
            ui.nav_item(name='#menu/ham', label='Ham'),
            ui.nav_item(name='#menu/eggs', label='Eggs'),
            ui.nav_item(name='#menu/toast', label='Toast', disabled=True),
        ]),
        ui.nav_group('Help', items=[
            ui.nav_item(name='#about', label='About', icon='Info'),
            ui.nav_item(name='#support', label='Support', icon='Help'),
        ])
    ],
)
```

## With persona

If the logo is already displayed somewhere else, e.g. top navigation, there is no need for duplication.

```py
persona = 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&h=750&w=1260'
q.page['nav'] = ui.nav_card(
    box='1 1 2 8',
    persona=ui.persona(title='John Doe', subtitle='Data Scientist', caption='Online', size='xl', image=persona),
    items=[
        ui.nav_group('Menu', items=[
            ui.nav_item(name='#menu/spam', label='Spam'),
            ui.nav_item(name='#menu/ham', label='Ham'),
            ui.nav_item(name='#menu/eggs', label='Eggs'),
            ui.nav_item(name='#menu/toast', label='Toast', disabled=True),
        ]),
        ui.nav_group('Help', items=[
            ui.nav_item(name='#about', label='About', icon='Info'),
            ui.nav_item(name='#support', label='Support', icon='Help'),
        ])
    ],
)
```

## With icon

Don't have a logo, but still want to give your app some identity? No problem, just use the `icon` attribute and pick one from [supported icons](/docs/icons).

```py
q.page['nav'] = ui.nav_card(
    box='1 1 2 7',
    title='H2O Wave',
    subtitle='And now for something completely different!',
    icon='Heart',
    items=[
        ui.nav_group('Menu', items=[
            ui.nav_item(name='#menu/spam', label='Spam'),
            ui.nav_item(name='#menu/ham', label='Ham'),
            ui.nav_item(name='#menu/eggs', label='Eggs'),
            ui.nav_item(name='#menu/toast', label='Toast', disabled=True),
        ]),
        ui.nav_group('Help', items=[
            ui.nav_item(name='#about', label='About', icon='Info'),
            ui.nav_item(name='#support', label='Support', icon='Help'),
        ])
    ],
)
```

## With selection

It's considered a good UX to let user know about the current location within the app. This is achieved by highlighting the currently active link. For these purposes, the `value` attribute can be used which takes the value of the `name` from specified `ui.nav_item`s.

```py
q.page['nav'] = ui.nav_card(
    box='1 1 2 6',
    value='#menu/spam',
    items=[
        ui.nav_group('Menu', items=[
            ui.nav_item(name='#menu/spam', label='Spam'),
            ui.nav_item(name='#menu/ham', label='Ham'),
            ui.nav_item(name='#menu/eggs', label='Eggs'),
            ui.nav_item(name='#menu/toast', label='Toast', disabled=True),
        ]),
        ui.nav_group('Help', items=[
            ui.nav_item(name='#about', label='About', icon='Info'),
            ui.nav_item(name='#support', label='Support', icon='Help'),
        ])
    ]
)
```

## Ajusting color

The default navigation background color is card color. However, if you need to give your side navigation more attention and better distinguish it from the main app content, you can also use the `color` attribute. Available values are `card` (default) and `primary`.

```py
q.page['nav'] = ui.nav_card(
    box='1 1 2 6',
    color='primary',
    items=[
        ui.nav_group('Menu', items=[
            ui.nav_item(name='#menu/spam', label='Spam'),
            ui.nav_item(name='#menu/ham', label='Ham'),
            ui.nav_item(name='#menu/eggs', label='Eggs'),
            ui.nav_item(name='#menu/toast', label='Toast', disabled=True),
        ]),
        ui.nav_group('Help', items=[
            ui.nav_item(name='#about', label='About', icon='Info'),
            ui.nav_item(name='#support', label='Support', icon='Help'),
        ])
    ]
)
```

## With path

Use a `path` attribute to navigate to internal or external hyperlink.

- Internal hyperlinks have paths that begin with a `/` and point to URLs within the Wave UI
- All other kinds of paths are treated as external hyperlinks (e.g. <https://h2o.ai/>)

```py
q.page['nav'] = ui.nav_card(
    box='1 1 2 6',
    items=[
        ui.nav_group('Menu', items=[
            ui.nav_item(name='internal_path_item', label='Internal', path='/demo'),
            ui.nav_item(name='external_path_item', label='External', path='https://h2o.ai/')
        ])
    ]
)
```
