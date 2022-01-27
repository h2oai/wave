---
title: Wide article preview
keywords:
  - article
  - preview
custom_edit_url: null
---

Horizontal article preview variant.

Check the full API at [ui.wide_article_preview_card](/docs/api/ui#wide_article_preview_card).

```py
persona_pic = 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=100&w=100'
q.page['example'] = ui.wide_article_preview_card(
    box='1 1 6 5',
    persona=ui.persona(title='Jasmine Grand', subtitle='Marketing Executive',
                        image=persona_pic, caption='caption'),
    commands=[
        ui.command(name='new', label='New', icon='Add', items=[
            ui.command(name='email', label='Email Message', icon='Mail'),
            ui.command(name='calendar', label='Calendar Event', icon='Calendar'),
        ]),
        ui.command(name='upload', label='Upload', icon='Upload'),
        ui.command(name='share', label='Share', icon='Share'),
        ui.command(name='download', label='Download', icon='Download'),
    ],
    aux_value='2h ago',
    image='https://images.pexels.com/photos/1269968/pexels-photo-1269968.jpeg?auto=compress',
    title='Jasmine Grand',
    caption='''
Duis porttitor tincidunt justo ac semper. Vestibulum et molestie lectus. Proin vel eros a ex condimentum aliquam.
Sed accumsan tellus sit amet nulla ullamcorper. Suspendisse bibendum tristique sem, quis lacinia ex pulvinar quis.
Nam elementum accumsan porta. Sed eget aliquam elit, sed luctus lorem. Nulla gravida malesuada purus eu eleifend.
Maecenas in ante interdum, hendrerit velit at, tempus eros. Nullam convallis tempor libero at viverra.
    ''',
    items=[
        ui.inline(justify='end', items=[
            ui.mini_buttons([   
                ui.mini_button(name='like', label='4', icon='Heart'),
                ui.mini_button(name='comment', label='2', icon='Comment'),
                ui.mini_button(name='share', label='1', icon='Share'),
            ])
        ])
    ]
)
```
