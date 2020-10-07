---
title: Event Arguments
---

When a user interacts with [components](components.md) on a page - like typing in text, making choices, clicking buttons, and so on - that information is available to your app in the form of *event arguments*.

The event arguments can be read from `q.args`, a read-only dictionary-like object passed to your `listen()` handler:

```py {4-6}
from h2o_q import Q, listen

async def serve(q: Q):
    print(q.args.foo)
    print(q.args.bar)
    print(q.args.qux)

listen('/foo', serve)
```

:::tip
`q.args` is an [Expando](api/core#Expando) instance, which means it behaves both like a dictionary and an object: `q.args['foo']` is the same as `q.args.foo`. `q.args.foo` is easier to read.
:::

## Interpreting arguments

The table below summarizes how to interpret inputs from various components.

| Component | If the component is named `foo`, the value of `q.args.foo` is... |
|---|---|
| `ui.button()` | `value` if provided, else `True`. |
| `ui.checkbox()` | `True` if checked, `False` if unchecked, `None` if indeterminate. |
| `ui.checklist()` | A list of names of all the selected choices (a list of strings). |
| `ui.choice_group()` | The name of the selected choice (a string). |
| `ui.color_picker()` | The selected color (a string). |
| `ui.combobox()` | Either the name of the selected choice or the value typed in (a string). |
| `ui.command()` | `data` if provided, else `True`. |
| `ui.date_picker()` | The selected date in `YYYY-MM-DD` format (a string). |
| `ui.dropdown()` | If multi-valued, a list of names of all the selected choices (a list of strings), otherwise the name of the selected choice (a string).  |
| `ui.expander()` | `True` if expanded, else `False`. |
| `ui.file_upload()` | A list of paths to the uploaded files (a list of strings). |
| `ui.nav_item()` | `True` if clicked. |
| `ui.picker()` | A list of names of all the selected choices (a list of strings). |
| `ui.range_slider()` | `[min, max]` (a list of two numbers). |
| `ui.slider()` | The selected value (a number). |
| `ui.spinbox()` | The selected value (a number). |
| `ui.table()` | A list of names of all the selected rows (a list of strings). |
| `ui.tabs()` | The name of the active tab (a string). |
| `ui.textbox()` | The value typed in (a string). |
| `ui.toggle()` | `True` if checked, `False` if unchecked. |
