---
title: Progress
keywords:
  - form
  - progress
custom_edit_url: null
---

It's common to perform tasks, that are not instant and can take some time. That's fine. What is not fine is giving your user no clue on what is going on. Use
[ui.progress](/docs/api/ui#progress) to let your users know that your app didn't crash or is hanging, it is just working on something that can take a while.

You can see the API for [ui.progress](/docs/api/ui#progress) or check the interactive example in Tour app.

## Standard progress

Prefer displaying determinate progress if possible. That way user has an idea about how long he is going to wait.

```py
q.page['example'] = ui.form_card(
    box='1 1 2 2',
    items=[ui.progress(label='Standard Progress', caption='Downloading...', value=0.25)]
)
```

## Indeterminate progress

Use this kind of progress as a last resort only. The UX it provides is only slightly better than displaying nothing.

```py
q.page['example'] = ui.form_card(
    box='1 1 2 2',
    items=[ui.progress(label='Indeterminate Progress', caption='Goes on forever')]
)
```
