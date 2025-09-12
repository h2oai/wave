---
title: Wide info
keywords:
  - info
custom_edit_url: null
---

Use info cards as entries leading to detail views or when you just need to display an image with a caption.

```py
q.page['example'] = ui.wide_info_card(
    box='1 1 5 4',
    name='info_card',
    title='Info Card',
    subtitle='Subtitle',
    caption='''
Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quia aliquam maxime quos facere
necessitatibus tempore eum odio, qui illum. Repellat modi dolor facilis odio ex possimus
ratione voluptate pariatur cupiditate, quidem quaerat sapiente exercitationem in omnis nulla
maiores consequatur dolores illo inventore quae obcaecati culpa totam corporis! Repudiandae, nostrum repellendus.
''',
    category='Category',
    label='Click me',
    image='https://images.pexels.com/photos/3225517/pexels-photo-3225517.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260'
)
```

Check the full API at [ui.wide_info_card](/docs/api/ui#wide_info_card).

## Icon

```py
q.page['example'] = ui.wide_info_card(
    box='1 1 5 4',
    name='info_card',
    title='Info Card',
    subtitle='Subtitle',
    caption='''
Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quia aliquam maxime quos facere
necessitatibus tempore eum odio, qui illum. Repellat modi dolor facilis odio ex possimus
ratione voluptate pariatur cupiditate, quidem quaerat sapiente exercitationem in omnis nulla
maiores consequatur dolores illo inventore quae obcaecati culpa totam corporis! Repudiandae, nostrum repellendus.
''',
    category='Category',
    label='Click me',
    icon='Heart'
)
```
