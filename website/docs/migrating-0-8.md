---
title: Migrating from 0.8
---

H2O Wave v0.9.0+ introduces significant improvements to application performance and concurrency, and brings us closer to a v1.0 release. v1.0 will include the ability to increase the number of worker processes to scale apps, while preserving the simplicity of the Wave API.

## ASGI Compatibility

Wave apps are now [ASGI](https://asgi.readthedocs.io/en/latest/)-compatible, based on the [high-performance](https://www.techempower.com/benchmarks/#section=data-r17&hw=ph&test=fortune&l=zijzen-1) [Uvicorn](https://www.uvicorn.org) / [Starlette](https://www.starlette.io/) duo.

You can run Wave apps behind any ASGI server, like [uvicorn](https://www.uvicorn.org), [gunicorn](https://gunicorn.org/), [daphne](https://github.com/django/daphne/), [hypercorn](https://pgjones.gitlab.io/hypercorn/), etc.

### Old way

In versions <= v0.8.0, a skeleton app looked like this:

```python title="foo.py" 
from h2o_wave import listen, Q

async def serve(q: Q):
    pass

listen('/qux', serve)
```

The above app could be run like this:

```shell
(venv) $ python foo.py
```

### New way

In versions v0.9.0+, a skeleton app looks like this:

```python {1,3} title="foo.py"
from h2o_wave import main, app, Q

@app('/qux')
async def serve(q: Q):
    pass
```

Notably:
1. `listen(route)` has been replaced by an `@app(route)` decorator on the `serve()` function.
2.  `main` needs to be imported into the file (but you don't have to do anything with the symbol `main` other than simply `import` it).

The above app can be run using `wave run`, built into the new `wave` command line interface. 

```shell
(venv) $ wave run foo
```

The `wave run` command runs your app using live-reload, which means you can view your changes live as you code, without having to refresh your browser manually.


To run your app without live-reload, simply pass `--no-reload`:

```shell
(venv) $ wave run --no-reload foo
```

To run your app using an ASGI server like uvicorn, append `:main` to the `app` argument:

```shell
(venv) $ uvicorn foo:main
```


