---
title: Wave Apps
---

A Wave app is the primary mechanism to publish interactive web content in Wave.

A Wave app can publish content and handle user interactions, unlike a [Wave script](scripts.md), which can publish content but not handle user interactions.

Here is the skeleton of a Wave app:

```py 
from h2o_wave import Q, main, app, ui

@app('/foo')
async def serve(q: Q):
    # Modify the page
    q.page['qux'] = ui.some_card()
    
    # Save the page
    await q.page.save()
```
## Listen and serve

`@app()` has one required argument - the route your app is interested in (in the above case `/foo`).

`main` is an [ASGI](https://asgi.readthedocs.io/en/latest/)-compatible function, and can be passed to an ASGI server any it starts an event loop listening for user interaction events, and announces itself to the Wave server. The Wave server then starts routing any user actions happening at `/foo` to your app. 

The `serve()` function is called every time the user performs some action at the route `/foo` (access the page, reload it, click a button, access a menu, enter text, and so on). 

The details about what action was performed, and who  performed the action, are available in the argument passed to `serve()`, the *query context* `q` (of type [Q](api/server#q)).

## Runtime context

The query context `q` carries the following attributes:

- `route`: The route at which the action was performed (in this case, `/foo`).
- `page`: A reference to the current [page](pages.md) (in this case, the page hosted at `/foo`).
- `site`: A reference to the page's parent site, from which you can grab references to other pages.
- `args`: The *event arguments*, a dictionary-like object containing information about the user action.
- `app`, `user`, `client`: Dictionary-like objects holding [server-side state](state.md), at the app-level, the user-level and the client-level, respectively. Here, 'client' refers to the browser tab.
- `username`: The username of the user who performed the action.
- `mode`: The [app's realtime mode](realtime.md), one of `unicast`, `multicast`, or `broadcast`.









