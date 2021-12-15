---
title: Article
keywords:
  - article
  - preview
custom_edit_url: null
---

For cases when an app needs to display large amounts of textual content, there are article cards.

Check the full API at [ui.article_card](/docs/api/ui#article_card).

```py
q.page['example'] = ui.article_card(
    box='1 1 4 5',
    title='Title',
    items=[
        ui.mini_buttons([
            ui.mini_button(name='like', label='4', icon='Heart'),
            ui.mini_button(name='comment', label='2', icon='Blog'),
            ui.mini_button(name='share', label='1', icon='Relationship'),
        ])
    ],
    content='''
Duis porttitor tincidunt justo ac semper. Vestibulum et molestie lectus. Proin vel eros a ex condimentum aliquam.
Sed accumsan tellus sit amet nulla ullamcorper. Suspendisse bibendum tristique sem, quis lacinia ex pulvinar quis.
Nam elementum accumsan porta. Sed eget aliquam elit, sed luctus lorem. Nulla gravida malesuada purus eu eleifend.
Maecenas in ante interdum, hendrerit velit at, tempus eros. Nullam convallis tempor libero at viverra.

## Heading 2

Duis porttitor tincidunt justo ac semper. Vestibulum et molestie lectus. Proin vel eros a ex condimentum aliquam.
Sed accumsan tellus sit amet nulla ullamcorper. Suspendisse bibendum tristique sem, quis lacinia ex pulvinar quis.
Nam elementum accumsan porta. Sed eget aliquam elit, sed luctus lorem. Nulla gravida malesuada purus eu eleifend.
Maecenas in ante interdum, hendrerit velit at, tempus eros. Nullam convallis tempor libero at viverra.
'''
)
```

## Tall article preview

When you have multiple articles and want to display them all and give the user a choice.

Check the full API at [ui.tall_article_preview_card](/docs/api/ui#tall_article_preview_card).

```py
content = '''
### Sub Header

Nunc scelerisque tincidunt elit. Vestibulum non mi ipsum. Cras pretium suscipit tellus sit ametsa aliquet.
'''
q.page['example'] = ui.tall_article_preview_card(
    box='1 1 4 6',
    title='Tall article preview',
    subtitle='Click the card',
    value='$19',
    name='tall_article',
    image='https://images.pexels.com/photos/3225517/pexels-photo-3225517.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
    content=content,
    items=[
        ui.buttons(items=[
            ui.button(name='like', label='Like'),
            ui.button(name='comment', label='Comment'),
            ui.button(name='share', label='Share'),
        ]),
    ]
)
```

:::tip
If you specify the `name` attribute, the whole card becomes clickable what can be used for leading into the detail view.
:::

## Wide article preview

Horizontal variant.

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
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsum sed odio porro veniam dolorum velit doloremque neque aliquam quisquam rem officiis, eius facilis iste quam, minus repellat magni iure eaque!
            Veniam pariatur itaque nisi, a nam consequuntur. Aliquam nulla sequi, nihil soluta quaerat vitae inventore magni vero voluptates officiis dolorem alias incidunt iure in sapiente doloribus, quos distinctio? Illo, ullam?
        ''',
        items=[
            ui.inline(justify='end', items=[
                ui.mini_buttons([   
                    ui.mini_button(name='like', label='4', icon='Heart'),
                    ui.mini_button(name='comment', label='2', icon='Comment'),
                    ui.mini_button(name='share', label='1', icon='Share'),
                ]),
            ])
        ],
    )
```