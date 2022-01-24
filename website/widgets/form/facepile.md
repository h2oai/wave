---
title: Facepile
keywords:
  - form
  - facepile
custom_edit_url: null
---

A face pile displays a list of personas. Each circle represents a person and contains their image or initials. Often this control is used when sharing who has access to a specific view or file.

```py
image = 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&h=750&w=1260'
q.page['example'] = ui.form_card(box='1 1 2 1', items=[
    ui.facepile([
        ui.persona(title='John Doe', image=image),
        ui.persona(title='John Doe', image=image),
        ui.persona(title='John Doe'),
        ui.persona(title='John Doe', image=image),
        ui.persona(title='John Doe', image=image),
    ])
])
```

Check the full API at [ui.facepile](/docs/api/ui#facepile).

## Limit number of facepiles

Use the `max` attribute to constrain the number of rendered facepiles.

```py
image = 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&h=750&w=1260'
q.page['example'] = ui.form_card(box='1 1 2 1', items=[
    ui.facepile(max=3, items=[
        ui.persona(title='John Doe', image=image),
        ui.persona(title='John Doe', image=image),
        ui.persona(title='John Doe'),
        ui.persona(title='John Doe', image=image),
        ui.persona(title='John Doe', image=image),
    ])
])
```

## Add button

Use the `name` attribute to render an "Add button" at the beginning of the facepile. Subsequent click will populate `q.args.<facepile-name>` with `True`.

```py
image = 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&h=750&w=1260'
q.page['example'] = ui.form_card(box='1 1 2 1', items=[
    ui.facepile(name='facepile', items=[
        ui.persona(title='John Doe', image=image),
        ui.persona(title='John Doe', image=image),
        ui.persona(title='John Doe'),
        ui.persona(title='John Doe', image=image),
        ui.persona(title='John Doe', image=image),
    ])
])
```
