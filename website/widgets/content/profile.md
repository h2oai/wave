---
title: Profile
keywords:
  - profile
custom_edit_url: null
---

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

## Content height

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
