---
title: Realtime Sync
---

Wave's realtime sync feature enables all connected users to see up to date content. 

Pages created by Wave scripts are automatically synced across all users. 

Pages created by Wave apps need to explicitly enable realtime sync. This is because apps support multiple users and multiple clients (browser tabs) by default, and, depending on the problem you're trying to solve, it's up to you to decide whether your app's UI should be synced across all users, synced across one user, or not synced at all.

To enable realtime sync in a Wave app, pass the `mode` argument to `listen()`:
- `mode='broadcast'` syncs across all users.
- `mode='multicast'` syncs across one user (in other words, all the clients for that user).
- `mode='unicast'` disables sync. This is the default.

```py {6}
from h2o_q import Q, listen, ui

async def serve(q: Q):
    pass

listen('/foo', serve, mode='broadcast')
```

If you change the mode, make sure you store run-time state appropriate to the mode. Generally:

| `mode` | Store state in |
|---|---|
|`broadcast`| `q.app` |
|`multicast`| `q.user` |
|`unicast`| `q.client` | 

