---
title: Tags
keywords:
  - form
  - tag
custom_edit_url: null
---

Used to display a set of tags in a row. Each tag consists of box with text inside.
Can be used in different scenarios including highlighting a specific keyword or holding a numeric value with different colors to indicate error, warning, or success.

Tags with numeric value as a label:

```py
q.page['example'] = ui.form_card(box='1 1 4 4', items=[
    ui.tags([
        ui.tag(color='#610404', label='1'),
        ui.tag(color='#7F6001', label='2'),
        ui.tag(color='#054007', label='3'),
    ])
])
```