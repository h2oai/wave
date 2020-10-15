---
title: Routing
---

## App routing

Your Wave app gets hosted at the route you passed to `listen()`.

```py {6}
from h2o_wave import Q, listen

async def serve(q: Q):
    pass

listen('/foo', serve)
```

To host your app at `localhost:55555/foo` or `www.example.com/foo`, pass `/foo` to `listen()`.

To host your app at `localhost:55555` or `www.example.com`, pass `/` to `listen()`. Do this if you plan to host exactly one app and nothing else.

You can host multiple apps behind a single Wave server.

:::caution
`/foo` and `/foo/bar` are two distinct paths. `/foo/bar` is not interpreted as a sub-path of `/foo`.
:::

## Hash routing

Wave apps support *hash routing*, a popular client-side mechanism where the location hash (the `baz/qux` in `/foo/bar#baz/qux`) can be used to decide which part of the UI to display.

### Setting the location hash

To set the location hash, prefix `#` to the `name` attribute of command-like components. When the command is invoked, the location hash is set to the name of the command.

For example, if a button is named `foo` is clicked, `q.args.foo` is set to `True`. Instead, if a button named `#foo` is clicked, the location hash is set to `foo` (`q.args.foo` is not set). 

```py {7-8}
from h2o_wave import Q, listen, ui

async def serve(q: Q):
    q.page['sides'] = ui.form_card(
        box='1 1 4 4',
        items=[
            ui.button(name='#heads', label='Heads'),
            ui.button(name='#tails', label='Tails'),
        ],
    )
    q.page.save()

listen('/toss', serve)
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

```py {4-8}
from h2o_wave import Q, listen, ui

async def serve(q: Q):
    hash = q.args['#']
    if hash == 'heads':
        print('Heads!')
    elif hash == 'tails':
        print('Tails!')

    q.page.save()

listen('/toss', serve)
```

### Hash route switching

Combining the two examples above gives us a basic pattern for handling routes and updating the user interface:


```py {6,8,10}
from h2o_wave import Q, listen, ui

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

    q.page.save()

listen('/toss', serve)
```
