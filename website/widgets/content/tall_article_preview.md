---
title: Tall article preview
keywords:
  - article
  - preview
custom_edit_url: null
---

When you have multiple articles, want to display them all and give the user a choice.

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
If you specify the `name` attribute, the whole card becomes clickable. This can be used for leading into the detail view.
:::
