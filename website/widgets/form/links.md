---
title: Links
keywords:
  - form
  - links
custom_edit_url: null
---

Hyperlinks can be internal (within Wave app) or external.
Internal hyperlinks have paths that begin with a `/` and point to URLs within the Wave UI.
All other kinds of paths are treated as external hyperlinks.

You can see the API for [ui.links](/docs/api/ui#links) or check the interactive example in Tour app.

## Basic links

```py
q.page['example'] = ui.form_card(box='1 1 2 2', items=[
    ui.links(label='Column', items=[
        ui.link(label='Sample link', path='https://www.h2o.ai/', target='_blank'),
        ui.link(label='Sample link', path='https://www.h2o.ai/', target='_blank'),
        ui.link(label='Sample link', path='https://www.h2o.ai/', target='_blank'),
    ])
])
```

## Inline links

If a horizontal version is needed, use the `inline` attribute.

```py
q.page['example'] = ui.form_card(box='1 1 4 2', items=[
    ui.links(inline=True, items=[
        ui.link(label='Sample link', path='https://www.h2o.ai/', target='_blank'),
        ui.link(label='Sample link', path='https://www.h2o.ai/', target='_blank'),
        ui.link(label='Sample link', path='https://www.h2o.ai/', target='_blank'),
    ])
])
```
