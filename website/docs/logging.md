---
title: Logging
---

Wave apps are plain Python programs. Use Python's built-in `logging` module to configure logging.

Here's a basic configuration that logs a ISO8601 timestamp, log level, and message:

```py {3,4}
from h2o_wave import Q, listen

import logging
logging.basicConfig(format='%(asctime)s %(levelname)s %(message)s')

async def serve(q: Q):
    logging.warning('All your base are belong to us')    

listen('/demo', serve)
```

The above snippet makes the app log a warning every time it is accessed. This is what the logged message look like:

```
2010-12-12 11:41:42,612 WARNING All your base are belong to us
```

:::info
See [Python's logging module](https://docs.python.org/3/howto/logging.html) for more information.
:::
