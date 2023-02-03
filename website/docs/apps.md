---
title: Wave Apps
---

A Wave app is the primary mechanism to publish interactive web content in Wave.

A Wave app can publish content and handle user interactions, unlike a [Wave script](scripts.md), which can publish content but not handle user interactions.

## Structure

Here is the skeleton of a Wave app:

```py title="app.py"
# Note: Main must be imported even though it is not used.
from h2o_wave import main, app, Q, ui

@app('/foo')
async def serve(q: Q):
    # Modify the page
    q.page['qux'] = ui.some_card()

    # Save the page
    await q.page.save()
```

An app typically imports four symbols from `h2o_wave`:

- `main`: An [ASGI](https://asgi.readthedocs.io/en/latest/)-compatible function. See [Deployment](deployment.md).
- `app`: A decorator for your query handler (or request handler).
- `Q`: A class that represents the query sent to your query handler.
- `ui`: The module containing the API for drawing UI elements.

`@app()` has one required argument - the route your app is interested in (in this case `/foo`). Whenever a user performs any action at `/foo` - access the page, reload it, click a button, access a menu, enter text, and so on - the query handler `serve()` is called. The details about what action was performed, and who  performed the action, are available in the argument passed to `serve()`, the *query context* `q` (of type [Q](api/server#q)).

Wave apps are run using the `wave run` command, which accepts the name of the Python module in which `main` is imported from `h2o_wave`.

:::warning
Do not remove imported `main` despite linters saying it's not used. It is used for marking the entrypoint file of your app.
:::

If your app is contained in `app.py`, run it like this:

```shell
wave run app
```

Or,

```shell
wave run app.py
```

If your app is contained in `path/to/app.py`, run it like this:

```shell
wave run path.to.app
```

Or,

```shell
wave run path/to/app.py
```

When run, the app starts an event loop listening for user interaction events, and announces itself to the Wave server. The Wave server then starts routing any user actions happening at `/foo` to your app.

## Runtime context

The query context `q` carries the following attributes:

- `route`: The route at which the action was performed (in this case, `/foo`).
- `page`: A reference to the current [page](pages.md) (in this case, the page hosted at `/foo`).
- `site`: A reference to the page's parent site, from which you can grab references to other pages.
- `args`: The *event arguments*, a dictionary-like object containing information about the user action.
- `app`, `user`, `client`: Dictionary-like objects holding [server-side state](state.md), at the app-level, the user-level and the client-level, respectively. Here, 'client' refers to the browser tab.
- `username`: The username of the user who performed the action.
- `mode`: The [app's realtime mode](realtime.md), one of `unicast`, `multicast`, or `broadcast`.

## Lifecycle

To perform actions at application startup and shutdown, pass `on_startup` and `on_shutdown` functions to `@app`, like this:

```py
from h2o_wave import main, app, Q, ui

def on_startup():
    print('App started!')

def on_shutdown():
    print('App stopped!')

@app('/foo', on_startup=on_startup, on_shutdown=on_shutdown)
async def serve(q: Q):
    pass
```

The `on_startup` and `on_shutdown` functions can also be `async`.
