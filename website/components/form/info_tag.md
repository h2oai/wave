---
title: Information Tag
keywords:
  - form
  - info_tag
custom_edit_url: null
---

Used to display a tag which consists of box with text inside.
Can be used in different scenarios including highlighting a specific keyword or holding a numeric value with different colors to indicate error, warning, or success.

Large tags with numeric value as a label:

```py
q.page['example'] = ui.form_card(box='1 1 4 4', items=[
    ui.inline(items=[
        ui.info_tag(name='tag-1', color='#610404', label='1', size='large'),
        ui.info_tag(name='tag-2', color='#7F6001', label='2', size='large'),
        ui.info_tag(name='tag-3', color='#054007', label='3', size='large'),
    ])
])
```

Small tags with text value as a label:

```py
q.page['example'] = ui.form_card(box='1 1 4 4', items=[
    ui.inline(items=[
        ui.info_tag(name='tag-1', color='#610404', label='Error', size='large'),
        ui.info_tag(name='tag-2', color='#7F6001', label='Warning', size='large'),
        ui.info_tag(name='tag-3', color='#054007', label='Success', size='large'),
    ])
])
```