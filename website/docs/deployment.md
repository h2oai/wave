---
title: Deployment
---

## Deploying Wave scripts

Wave scripts are regular Python scripts. Deploy them as you would any Python script.

## Deploying Wave apps

Wave apps are [ASGI](https://asgi.readthedocs.io/en/latest/)-compatible, based on [Uvicorn](https://www.uvicorn.org) / [Starlette](https://www.starlette.io/), a [high-performance](https://www.techempower.com/benchmarks/#section=data-r17&hw=ph&test=fortune&l=zijzen-1) Python server.

You can run Wave apps behind any ASGI server, like [uvicorn](https://www.uvicorn.org), [gunicorn](https://gunicorn.org/), [daphne](https://github.com/django/daphne/), [hypercorn](https://pgjones.gitlab.io/hypercorn/), etc.

To run your app using an ASGI server, append `:main` to the `app` argument. For example, if you were normally executing your app `foo.py` using `wave run foo`, and want to run your app using Uvicorn, use `uvicorn foo:main`.

These commands are equivalent:

```shell
(venv) $ wave run --no-reload --no-autostart foo
```

```shell
(venv) $ uvicorn foo:main
```

For more information, see [uvicorn.org/deployment](https://www.uvicorn.org/deployment/) and [starlette.io/#performance](https://www.starlette.io/#performance).
