---
title: Query Arguments
---

When a user interacts with [components](/docs/widgets/overview) on a page - like typing in text, making choices, clicking buttons, and so on - that information is available to your app in the form of *query arguments*.

The query arguments can be read from `q.args`, a read-only dictionary-like object passed to your `@app()` handler:

```py {5-7}
from h2o_wave import Q, main, app

@app('/foo')
async def serve(q: Q):
    print(q.args.foo)
    print(q.args.bar)
    print(q.args.qux)
```

:::tip
`q.args` is an [Expando](api/core#Expando) instance, which means it behaves both like a dictionary and an object: `q.args['foo']` is the same as `q.args.foo`. `q.args.foo` is easier to read.
:::

## Interpreting arguments

The table below summarizes how to interpret inputs from various components.

| Component | If the component is named `foo`, the value of `q.args.foo` is... |
|---|---|
| `ui.button()` | `value` if provided, else `True`. |
| `ui.breadcrumb()` | `True` if clicked. |
| `ui.checkbox()` | `True` if checked, `False` if unchecked, `None` if indeterminate. |
| `ui.checklist()` | A list of names of all the selected choices (a list of strings). |
| `ui.choice_group()` | The name of the selected choice (a string). |
| `ui.color_picker()` | The selected color (a string). |
| `ui.combobox()` | Either the name of the selected choice or the value typed in (a string). |
| `ui.command()` | `value` if provided, else `True`. |
| `ui.date_picker()` | The selected date in `YYYY-MM-DD` format (a string). |
| `ui.dropdown()` | If multi-valued, a list of names of all the selected choices (a list of strings), otherwise the name of the selected choice (a string).  |
| `ui.expander()` | `True` if expanded, else `False`. |
| `ui.facepile()` | `value` if provided, else `True`. |
| `ui.file_upload()` | A list of paths to the uploaded files (a list of strings). |
| `ui.nav_item()` | `True` if clicked. |
| `ui.persona()` | `True` if clicked. |
| `ui.picker()` | A list of names of all the selected choices (a list of strings). |
| `ui.range_slider()` | `[min, max]` (a list of two numbers). |
| `ui.slider()` | The selected value (a number). |
| `ui.spinbox()` | The selected value (a number). |
| `ui.table()` | A list of names of all the selected rows (a list of strings). |
| `ui.tabs()` | The name of the active tab (a string). |
| `ui.textbox()` | The value typed in (a string). |
| `ui.text_annotator()` | List of lists containing parts of text with accompanying tag (if not annotated, tag is `''`). |
| `ui.toggle()` | `True` if checked, `False` if unchecked. |

## App-wide global loading spinner

Wave assumes that every user interaction (every time `q.args` or `q.events` is submitted to the app) needs to result in a UI update. The reason is proper UX - you should always inform your user what's going on, give them feedback. With this assumption, we try to make the UI unclickable (to prevent double submission) until server responds with the newest changes.

You should always handle:

* Button clicks.
* Actions that result in sending events (e.g. plots, dismissing dialogs).
* Every input into components having `trigger=True` set.

There might be very specific cases when you would want to get around this behavior. The solution is to update any card, even non-existent so simply specifying `q.page['non-existent'].items = []` will result in loading spinner going away. However, you should almost always default to proper UX, thus update the UI properly and inform your user about what's currently happening within the app.

## Handling interactivity

A common pattern for inspecting query arguments and determining the appropriate response is a simple `if/elif/else` conditional.

If `add_to_cart`, `empty_cart`, `place_order` and `display_products` are all names of buttons somewhere in the user interface, then you can structure your `serve()` function something like this:

```py {17-24}
from h2o_wave import Q, main, app

async def add_to_cart(q: Q):
    pass

async def empty_cart(q: Q):
    pass

async def place_order(q: Q):
    pass

async def display_products(q: Q):
    pass

@app('/hole_foods')
async def serve(q: Q):
    if q.args.add_to_cart:
        await add_to_cart(q)
    elif q.args.empty_cart:
        await empty_cart(q)
    elif q.args.place_order:
        await place_order(q)
    else: # Display products
        await display_products(q)

```

If this feels too repetitive, you can use `on` and `run_on` to remove some of the boilerplate:

```py {3,7,11,15,21}
from h2o_wave import Q, main, app, on, run_on

@on('add_to_cart')
async def add_to_cart(q: Q):
    pass

@on('empty_cart')
async def empty_cart(q: Q):
    pass

@on('place_order')
async def place_order(q: Q):
    pass

@on('display_products')
async def display_products(q: Q):
    pass

@app('/hole_foods')
async def serve(q: Q):
    await run_on(q)

```

In the above example, the `@on('add_to_cart')` is read as "when `q.arg['add_to_cart']` is `True` (or truthy), then invoke the function the `@on()` is applied to" - in this case, `add_to_cart()`.

If the name of the function is the same as the name of the query argument, then the name can be elided. This simplifies the above example to:

```py {3,7,11,15}
from h2o_wave import Q, main, app, on, run_on

@on()
async def add_to_cart(q: Q):
    pass

@on()
async def empty_cart(q: Q):
    pass

@on()
async def place_order(q: Q):
    pass

@on()
async def display_products(q: Q):
    pass

@app('/hole_foods')
async def serve(q: Q):
    await run_on(q)

```

:::tip
`@on()` also supports pattern matching. See [Routing](routing.md) for more information.
:::
