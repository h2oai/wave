---
title: Link
keywords:
  - form
  - link
custom_edit_url: null
---

Hyperlinks can be internal (within Wave app) or external.
Internal hyperlinks have paths that begin with a `/` and point to URLs within the Wave UI.
All other kinds of paths are treated as external hyperlinks.

You can see the API for [ui.link](/docs/api/ui#link) or check the interactive example in Tour app.

## Basic link

```py
q.page['example'] = ui.form_card(box='1 1 2 2', items=[
    ui.link(label='Go to h2o.ai', path='https://www.h2o.ai/')
])
```

## With a target

Where to display the link. Setting this to an empty string or `'_blank'` opens the link in a new tab or
window.

```py
q.page['example'] = ui.form_card(box='1 1 2 2', items=[
    ui.link(label='Go to h2o.ai', path='https://www.h2o.ai/', target='_blank')
])
```

## Disabled link

Used for cases when the link should not be clickable.

```py
q.page['example'] = ui.form_card(box='1 1 2 2', items=[
    ui.link(label='Go to h2o.ai', path='https://www.h2o.ai/', disabled=True)
])
```

## With button

Links don't only need to be rendered as text. If you would like to give your links more attention
(e.g. the link is a final result of some more complex action) you can render it as a `button`.

```py
q.page['example'] = ui.form_card(box='1 1 2 2', items=[
    ui.link(label='Go to h2o.ai', path='https://www.h2o.ai/', button=True)
])
```

## Download link

If you want to allow your users to download a file, use the `download` attribute.

The `download` attribute will only start the download if the path points to a location on the same origin (wave server).

```py
q.page['example'] = ui.form_card(box='1 1 2 2', items=[
    ui.link(label='Go to h2o.ai', path='https://www.h2o.ai/', download=True)
])
```
