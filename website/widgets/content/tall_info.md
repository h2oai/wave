---
title: Tall info
keywords:
  - info
custom_edit_url: null
---

Use info cards as entries leading to detail views or when you just need to display an image with a caption.

```py
q.page['example'] = ui.tall_info_card(
    box='1 1 3 4',
    name='info_card',
    title='Info Card',
    caption='Lorem ipsum dolor sit amet consectetur adipisicing elit.',
    category='Category',
    label='Click me',
    image='https://images.pexels.com/photos/3225517/pexels-photo-3225517.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
)
```

Check the full API at [ui.tall_info_card](/docs/api/ui#tall_info_card).

## Icon

```py
q.page['example'] = ui.tall_info_card(
    box='1 1 3 4',
    name='info_card',
    title='Info Card',
    caption='Lorem ipsum dolor sit amet consectetur adipisicing elit.',
    category='Category',
    label='Click me',
    icon='Heart',
)
```
