---
title: Preview
keywords:
  - preview
custom_edit_url: null
---

Use a preview card to lead into a detail view or when you just want to be fancy with displaying a background image under your textual content.

Check the full API at [ui.preview_card](/docs/api/ui#preview_card).

```py
q.page['example'] = ui.preview_card(
    name='preview_card',
    box='1 1 3 4',
    image='https://images.pexels.com/photos/1269968/pexels-photo-1269968.jpeg?auto=compress',
    title='Post title',
    items=[ui.mini_buttons([
        ui.mini_button(name='like', label='4', icon='Heart'),
        ui.mini_button(name='comment', label='2', icon='Comment'),
        ui.mini_button(name='share', label='1', icon='Share'),
    ])
    ],
    caption='''
          Lorem ipsum dolor sit amet, coectetur adipiscing elit. Etiam ut hendrerit lectus.As Etiam venenatis id nulla a molestie.
          Lorem ipsum dolor sit amet, coectetur adipiscing elit. Etiam ut hendrerit lectus.As Etiam venenatis id nulla a molestie.
            ''',
    label='Click me'
)
```
