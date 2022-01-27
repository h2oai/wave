---
title: Expander
keywords:
  - form
  - expander
custom_edit_url: null
---

If you need to group related content and allow user to hide / show it on demand, use [ui.expander](/docs/api/ui#expander). It can be useful for cases
when there are a lot of form elements and the screen is cramped.

```py
q.page['form'] = ui.form_card(
    box='1 1 2 4',
    items=[ui.expander(name='expander', label='Expander example', items=[
        ui.textbox(name='textbox1', label='Textbox 1'),
        ui.textbox(name='textbox2', label='Textbox 2'),
        ui.textbox(name='textbox3', label='Textbox 3'),
    ])],
)
```

:::tip
Use `expanded` attr to toggle between collapsed/expanded state.
:::

Check the full API at [ui.expander](/docs/api/ui#expander).
