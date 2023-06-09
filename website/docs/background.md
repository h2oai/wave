---
title: Background Tasks
---

Wave apps are servers based on [asyncio](https://docs.python.org/3/library/asyncio.html), Python's library for Asynchronous I/O, and lets you develop and deploy high-performance applications.

Your `@app` query handler is invoked every time a user performs some action in your app's UI - access the page, reload it, click a button, access a menu, enter text, and so on. Performing blocking operations in your handler will hang your app's server and make your app's UI appear unresponsive until the blocking operation completes.

In some cases, blocking calls can be pushed to the background to improve concurrency. To achieve this, the Wave API provides two lightweight wrappers over [asyncio.run_in_executor()](https://docs.python.org/3/library/asyncio-eventloop.html#asyncio.loop.run_in_executor): `q.run()` and `q.exec()`.

Here is an example of a function that blocks:

```python {1,4}
import time

def blocking_function(seconds) -> str:
    time.sleep(seconds)  # Blocks!
    return f'Done!'
```

To call the above function from an app, don't do this:

```python {4}
@app('/demo')
async def serve(q: Q):
    # ...
    message = blocking_function(42)
    # ...
```

Instead, do this:

```python {4}
@app('/demo')
async def serve(q: Q):
    # ...
    message = await q.run(blocking_function, 42)
    # ...
```

`q.run()` runs the blocking function in the background, in-process.

Depending on your use case, you might want to use a separate process pool or thread pool from Python's [multiprocessing](https://docs.python.org/3/library/multiprocessing.html) library, like this:

```python {1,6-7}
import concurrent.futures

@app('/demo')
async def serve(q: Q):
    # ...
    with concurrent.futures.ThreadPoolExecutor() as pool:
        message = await q.exec(pool, blocking_function, 42)
    # ...
```

`q.exec()` accepts a custom process pool or thread pool to run the blocking function.

```python {1,6-7}
import concurrent.futures

@app('/demo')
async def serve(q: Q):
    # ...
    with concurrent.futures.ProcessPoolExecutor() as pool:
        message = await q.exec(pool, blocking_function, seconds)
    # ...
```

:::tip
Apps that make calls to external services or APIs are better off replacing blocking HTTP clients like [requests](https://requests.readthedocs.io/en/master/) with non-blocking clients like [HTTPX](https://www.python-httpx.org/async/).
:::

To update UI from within a background job, see [this example](/docs/examples/background-progress/) or a detailed [blog post](https://medium.com/@unusualcode/background-jobs-in-wave-or-how-not-to-kill-your-ui-ae1fed95693a).
