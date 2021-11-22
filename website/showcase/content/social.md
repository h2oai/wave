---
title: Social
keywords:
  - social
custom_edit_url: null
---

Social cards are used for user-related content. Useful when you need to display an author or owner of a particular part of your app.

## Profile card

Display detailed info about a user.

```py
image = 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&h=750&w=1260'
q.page['example'] = ui.profile_card(
    box='1 1 3 5',
    image='https://images.pexels.com/photos/3225517/pexels-photo-3225517.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
    persona=ui.persona(title='John Doe', subtitle='Data Scientist', image=image),
    items=[
        ui.inline(justify='center', items=[
            ui.mini_buttons([
                ui.mini_button(name='upload', label='Upload', icon='Upload'),
                ui.mini_button(name='share', label='Share', icon='Share'),
                ui.mini_button(name='download', label='Download', icon='Download'),
            ])
        ]),
        ui.inline(justify='center', items=[
            ui.button(name='btn1', label='Button 1'),
            ui.button(name='btn2', label='Button 2'),
            ui.button(name='btn3', label='Button 3'),
        ]),
    ]
)
```

Check the full API at [ui.profile_card](/docs/api/ui#profile_card).

### Content height

By default, the background image takes all available free space. This behavior should suffice for most of the use cases. However, a higher degree of control might be needed when rendering multiple profile cards with unknown content lengths. In these cases, using the `height` attribute helps you to make sure every card looks the same. See our [Twitter sentiment app](https://github.com/h2oai/wave-apps/tree/main/twitter-sentiment) to see this scenario in action.

```py
image = 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&h=750&w=1260'
q.page['example'] = ui.profile_card(
    box='1 1 3 4',
    image='https://images.pexels.com/photos/3225517/pexels-photo-3225517.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
    persona=ui.persona(title='John Doe', subtitle='Data Scientist', image=image),
    height='300px',
    items=[
        ui.inline(justify='center', items=[
            ui.mini_buttons([
                ui.mini_button(name='upload', label='Upload', icon='Upload'),
                ui.mini_button(name='share', label='Share', icon='Share'),
                ui.mini_button(name='download', label='Download', icon='Download'),
            ])
        ]),
        ui.inline(justify='center', items=[
            ui.button(name='btn1', label='Button 1'),
            ui.button(name='btn2', label='Button 2'),
            ui.button(name='btn3', label='Button 3'),
        ]),
    ]
)
```

## Postcard

Need a slightly more complex layout than `ui.profile_card`? Use `ui.postcard_card` instead!

Check the full API at [ui.postcard_card](/docs/api/ui#postcard_card).

```py
image = 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&h=750&w=1260'
q.page['example'] = ui.postcard_card(
    box='1 1 3 5',
    persona=ui.persona(title='John Doe', subtitle='Data Scientist', image=image, caption='caption'),
    commands=[
        ui.command(name='new', label='New', icon='Add', items=[
            ui.command(name='email', label='Email Message', icon='Mail'),
            ui.command(name='calendar', label='Calendar Event', icon='Calendar'),
        ]),
        ui.command(name='upload', label='Upload', icon='Upload'),
        ui.command(name='share', label='Share', icon='Share'),
        ui.command(name='download', label='Download', icon='Download'),
    ],
    items=[
        ui.inline(justify='end', items=[
            ui.mini_buttons([
                ui.mini_button(name='like', label='4', icon='Heart'),
                ui.mini_button(name='comment', label='2', icon='Comment'),
                ui.mini_button(name='share', label='1', icon='Share'),
            ]),
        ]),
        ui.buttons(items=[
            ui.button(name='like', label='Like'),
            ui.button(name='comment', label='Comment'),
            ui.button(name='share', label='Share'),
        ]),
    ],
    caption='''
Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quia aliquam maxime quos facere
necessitatibus tempore eum odio, qui illum. Repellat modi dolor facilis odio ex possimus
''',
    aux_value='2h ago',
    image='https://images.pexels.com/photos/3225517/pexels-photo-3225517.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260'
)
```
