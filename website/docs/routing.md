---
title: Routing
---

## App routing

Your Wave app gets hosted at the route you passed to `@app()`.

```py {3}
from h2o_wave import Q, main, app

@app('/foo')
async def serve(q: Q):
    pass
```

To host your app at `localhost:10101/foo` or `www.example.com/foo`, pass `/foo` to `@app()`.

To host your app at `localhost:10101` or `www.example.com`, pass `/` to `@app()`. Do this if you plan to host exactly one app and nothing else.

You can host multiple apps behind a single Wave server.

:::caution
`/foo` and `/foo/bar` are two distinct paths. `/foo/bar` is not interpreted as a sub-path of `/foo`.
:::

## Hash routing

Wave apps support *hash routing*, a popular client-side mechanism where the location hash (the `baz/qux` in `/foo/bar#baz/qux`) can be used to decide which part of the UI to display.

### Setting the location hash

To set the location hash, prefix `#` to the `name` attribute of command-like components. When the command is invoked, the location hash is set to the name of the command.

For example, if a button is named `foo` is clicked, `q.args.foo` is set to `True`. Instead, if a button named `#foo` is clicked, the location hash is set to `foo` (`q.args.foo` is not set). 

```py {8-9}
from h2o_wave import Q, main, app, ui

@app('/toss')
async def serve(q: Q):
    q.page['sides'] = ui.form_card(
        box='1 1 4 4',
        items=[
            ui.button(name='#heads', label='Heads'),
            ui.button(name='#tails', label='Tails'),
        ],
    )
    await q.page.save()
```

Names don't have to be alphanumeric, so you can use names with nested sub-paths like `#foo/bar`, `#foo/bar/baz`, `#foo/bar/baz/qux` to make route-handling more manageable.

The components that support setting a location hash are:
- `ui.button()`
- `ui.command()`
- `ui.nav_item()`
- `ui.tab()`
- `ui.breadcrumb()`

### Getting the location hash

To get the location hash, read `q.args['#']` (a string). If the route in the browser's address bar is `/foo/bar#baz/qux`, `q.args['#']` is set to `baz/qux`.

```py {5-9}
from h2o_wave import Q, main, app, ui

@app('/toss')
async def serve(q: Q):
    hash = q.args['#']
    if hash == 'heads':
        print('Heads!')
    elif hash == 'tails':
        print('Tails!')

    q.page.save()
```

### Hash route switching

Combining the two examples above gives us a basic pattern for handling routes and updating the user interface:


```py {7,9,11}
from h2o_wave import Q, main, app, ui

@app('/toss')
async def serve(q: Q):
    hash = q.args['#']

    if hash == 'heads':
        q.page['sides'].items = [ui.message_bar(text='Heads!')]
    elif hash == 'tails':
        q.page['sides'].items = [ui.message_bar(text='Tails!')]
    else:
        q.page['sides'] = ui.form_card(
            box='1 1 4 4',
            items=[
                ui.button(name='#heads', label='Heads'),
                ui.button(name='#tails', label='Tails'),
            ],
        )

    await q.page.save()
```

### Organizing code

In most sizeable applications, the logic in the above `if/elif/else` conditionals can call into sub-functions, possibly spread across other modules:


```py {23,25,27}
from h2o_wave import Q, main, app, ui

async def on_heads(q: Q):
    q.page['sides'].items = [ui.message_bar(text='Heads!')]

async def on_tails(q: Q):
    q.page['sides'].items = [ui.message_bar(text='Tails!')]

async def setup_page(q: Q):
    q.page['sides'] = ui.form_card(
        box='1 1 4 4',
        items=[
            ui.button(name='#heads', label='Heads'),
            ui.button(name='#tails', label='Tails'),
        ],
    )

@app('/toss')
async def serve(q: Q):
    hash = q.args['#']

    if hash == 'heads':
        await on_heads(q)
    elif hash == 'tails':
        await on_tails(q)
    else:
        await setup_page(q)

    await q.page.save()
```

### Reducing boilerplate

As your application gets larger, using the above `if/elif/else` conditionals can seem tedious or repetitive. If so, you can use `on` and `handle_on` to reduce the boilerplate.


```py {3,7,22}
from h2o_wave import Q, main, app, ui, on, handle_on

@on('#heads')
async def on_heads(q: Q):
    q.page['sides'].items = [ui.message_bar(text='Heads!')]

@on('#tails')
async def on_tails(q: Q):
    q.page['sides'].items = [ui.message_bar(text='Tails!')]

async def setup_page(q: Q):
    q.page['sides'] = ui.form_card(
        box='1 1 4 4',
        items=[
            ui.button(name='#heads', label='Heads'),
            ui.button(name='#tails', label='Tails'),
        ],
    )

@app('/toss')
async def serve(q: Q):
    if not await handle_on(q):
        await setup_page(q)

    await q.page.save()
```

In the above example, the `@on('#heads')` is read as "if `q.args['#']` is `'heads'`, then invoke the function the `@on()` is applied to" - in this case, `on_heads()`.


### Pattern matching

The `@on()` annotation supports pattern matching.

This function is called when `q.args['#'] == 'menu'`:

```py
@on('#menu')
async def show_menu(q: Q):
    pass
```

This function is called when `q.args['#'] == 'menu/donuts'`:

```py
@on('#menu/donuts')
async def show_donuts(q: Q):
    pass
```

This function is called when `q.args['#']` matches, say, 'menu/donuts/chocolate', with the parameter `donut_name` set to 'chocolate':

```py
@on('#menu/donuts/{donut_name}')
async def show_donut(q: Q, donut_name: str):
    pass
```

Same as above, but `donut_name` is explicitly set to a string:

```py
@on('#menu/donuts/{donut_name:str}')
async def show_donut(q: Q, donut_name: str):
    pass
```

This function is called when `q.args['#']` matches, say, 'menu/donuts/42',  with the parameter `donut_id` set to 42:

```py
@on('#menu/donuts/{donut_id:int}')
async def show_donut(q: Q, donut_id: int):
    pass
```

This function is called when `q.args['#']` matches, say, 'menu/donuts/7e21c93f-3a8f-4994-b63e-4275bc975e60', with the parameter `donut_id` set to the UUID:

```py
@on('#menu/donuts/{donut_id:uuid}')
async def show_donut(q: Q, donut_id: uuid.UUID):
    pass
```

This function is called when `q.args['#']` matches, say, 'menu/donuts/below/2.99', with the parameter `donut_price` set to 2.99:

```py
@on('#menu/donuts/below/{donut_price:float}')
async def show_donuts_below(q: Q, donut_price: float):
    pass
```
