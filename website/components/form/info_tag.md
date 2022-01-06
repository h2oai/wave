---
title: Information Tag
keywords:
  - form
  - info_tag
custom_edit_url: null
---

Used to display a tag with text inside.

```py
page['example'] = ui.form_card(box='1 1 4 4', items=[
    ui.inline(items=[
        ui.info_tag(name='tag-1', color='#610404', label='2', size='large'),
        ui.info_tag(name='tag-2', color='#7F6001', label='1', size='large'),
        ui.info_tag(name='tag-3', color='#054007', label='3', size='large'),
    ])
])
```