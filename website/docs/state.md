---
title: State
---

How you manage your Q app's state depends on your app's requirements. In most cases, an app's data is best stored in a database or data store of some kind. But sometimes it's convenient to store run-time information in your app's memory, especially during prototyping when you trying to iterate quickly and refine ideas.

In a Q app, you can store run-time information at three levels:
- **App-level:** Information shared across all users.
- **User-level:** Information private to a user, but shared across all browser tabs.
- **Client-level:** Information private to a browser tab.

In real world apps, the decision on whether to store information at the client, user, or app level depends on the problem you're trying to solve. For example, if you were building an online store, you'd probably want to store product inventory at the app level and shopping carts at the user level. Most other kinds of information - search results, past orders, or product details - are best stored at the client-level (searching for products in one tab and having search results appear in another tab would drive even your most loyal customers up the wall).

In other words, your Q app is multi-user by default, but how your app manages data at the app-level, at the user-level and at the client-level is up to you.

The Q app runtime context `q` (of type [Q](api/server#q)) carries `q.app`, `q.user`, and `q.client`, three dictionary-like objects for storing information at the app-level, user-level, and client-level, respectively. 

:::tip
`q.app`, `q.user`, and `q.client` are all [Expando](api/core#Expando) instances, which means they behave both like dictionaries and objects: `q.client['foo']` is the same as `q.client.foo`. `q.client.foo` is easier to read.
:::


In most non-trivial apps, you'll find yourself frequently copying values from `q.args` into `q.client` (or `q.user`, depending on the problem you're solving). If this gets too repetitive for your taste, use `copy_expando()` to copy everything in `q.args` to `q.client` at the beginning of your `listen()` handler:

```py {4}
from h2o_q import Q, listen, copy_expando

async def serve(q: Q):
    copy_expando(q.args, q.client)
    # Do something else...

listen('/foo', serve)
```

