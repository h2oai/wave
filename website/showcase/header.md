---
title: Header
keywords:
  - header
custom_edit_url: null
---

The upper part of the app, providing general information about the app. Ideally, this would include the name of your app, your logo brand and navigation if needed.

Check the full API at [ui.header_card](/docs/api/ui#header_card).

```py
q.page['header'] = ui.header_card(
    box='1 1 5 1',
    title='My app',
    subtitle='My app subtitle',
    image='https://www.h2o.ai/wp-content/themes/h2o2018/templates/dist/images/h2o_logo.svg',
)
```

## I don't have a logo

In this case, you can specify the `icon` attribute and pick one of the [supported icons](https://uifabricicons.azurewebsites.net/). Note that the `icon` attribute is mutually exclusive with the `image` attribute.

```py
q.page['header'] = ui.header_card(
    box='1 1 5 1',
    title='My app',
    subtitle='My app subtitle',
    icon='Heart'
)
```

## Hamburger menu

For mobile versions of your app, when there is not much space to waste, it can be handy to display a hamburger menu icon which upon clicking expands the side nav with the navigation links. Simply use the `nav` attribute.

:::tip
When developing for larger screen sizes, avoid the hamburger as your links can be easily visible at all times, improving UX by not requiring extra click during navigation.
:::

```py
q.page['header'] = ui.header_card(
    box='1 1 5 1',
    title='My app',
    subtitle='My app subtitle',
    nav=[
        ui.nav_group('Menu', items=[
            ui.nav_item(name='#menu/spam', label='Spam'),
            ui.nav_item(name='#menu/ham', label='Ham'),
            ui.nav_item(name='#menu/eggs', label='Eggs'),
        ]),
        ui.nav_group('Help', items=[
            ui.nav_item(name='#about', label='About'),
            ui.nav_item(name='#support', label='Support'),
        ])
    ],
)
```

## Items on the right-hand side

The header also supports including app-level actions like links, global search, app theme toggle, currently logged user, etc. Simply use the `items` attribute.

```py
q.page['header'] = ui.header_card(
    box='1 1 5 1',
    title='My app',
    subtitle='My app subtitle',
    image='https://www.h2o.ai/wp-content/themes/h2o2018/templates/dist/images/h2o_logo.svg',
    items=[
        ui.links(inline=True, items=[
            ui.link(label='Sample link', path='https://www.h2o.ai/', target='_blank'),
            ui.link(label='Sample link', path='https://www.h2o.ai/', target='_blank'),
            ui.link(label='Sample link', path='https://www.h2o.ai/', target='_blank'),
        ])
    ]
)
```

```py
q.page['header'] = ui.header_card(
    box='1 1 5 1',
    title='My app',
    subtitle='My app subtitle',
    image='https://www.h2o.ai/wp-content/themes/h2o2018/templates/dist/images/h2o_logo.svg',
    items=[ui.textbox(name='search', icon='Search', width='300px', placeholder='Search...')]
)
```

```py
q.page['header'] = ui.header_card(
    box='1 1 5 1',
    title='My app',
    subtitle='My app subtitle',
    image='https://www.h2o.ai/wp-content/themes/h2o2018/templates/dist/images/h2o_logo.svg',
    items=[ui.toggle(name='theme', label='Toggle dark theme')]
)
```

```py
image = 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&h=750&w=1260'
q.page['header'] = ui.header_card(
    box='1 1 5 1',
    title='My app',
    subtitle='My app subtitle',
    image='https://www.h2o.ai/wp-content/themes/h2o2018/templates/dist/images/h2o_logo.svg',
    items=[ui.menu(image=image, items=[
        ui.command(name='profile', label='Profile', icon='Contact'),
        ui.command(name='preferences', label='Preferences', icon='Settings'),
        ui.command(name='logout', label='Logout', icon='SignOut'),
    ])]
)
```

## Displaying items in the center

Complex apps can have a lot of actions to display in the header, but showing them all together on one side can feel a bit cramped. To avoid these situations, Wave supports the `secondary_items` attribute that will put the specified items into the center of the header. However, note that this works only if `items` are populated.

```py
q.page['header'] = ui.header_card(
    box='1 1 7 1',
    title='Transparent header',
    subtitle='And now for something completely different!',
    image='https://www.h2o.ai/wp-content/themes/h2o2018/templates/dist/images/h2o_logo.svg',
    items=[
        ui.button(name='btn1', label='Button 1'),
        ui.button(name='btn2', label='Button 2'),
    ],
    secondary_items=[ui.textbox(name='search', icon='Search', width='200px', placeholder='Search...')]
)
```

## Color

By default, the header's background is `primary` color which aims to separate the header from the rest of the app. However, we realize that the contrast can be too loud sometimes, especially when the primary color is too gaudy. For these scenarios, you can use the `color` attribute which supports `card`, `transparent` and `primary` values.

```py
q.page['header'] = ui.header_card(
    box='1 1 5 1',
    title='Primary color',
    subtitle='And now for something completely different!',
    image='https://www.h2o.ai/wp-content/themes/h2o2018/templates/dist/images/h2o_logo.svg',
    color='primary'
)
```

```py
q.page['header'] = ui.header_card(
    box='1 1 5 1',
    title='Card color',
    subtitle='And now for something completely different!',
    image='https://www.h2o.ai/wp-content/themes/h2o2018/templates/dist/images/h2o_logo.svg',
    color='card'
)
```

```py
q.page['header'] = ui.header_card(
    box='1 1 5 1',
    title='Transparent color',
    subtitle='And now for something completely different!',
    image='https://www.h2o.ai/wp-content/themes/h2o2018/templates/dist/images/h2o_logo.svg',
    color='transparent'
)
```
