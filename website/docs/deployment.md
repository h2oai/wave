---
title: Deployment
---

At the end of the day, Wave produces web-apps with their own web server. This means any VM provider can be used for Wave deployment.

It's highly recommended to run Wave server (waved) [separately](/docs/tutorial-hello/#step-1-start-the-wave-server) from Wave app for production deployment.

More info about various configuration options can be found in the [configuration section](/docs/configuration).

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

To configure a different port, see [configuring ports](/docs/configuration/#how-to-start-a-wave-app-on-a-different-port).

:::tip
`uvicorn` accepts `--env-file` flag to specify `.env` configuration file for the Wave app. Note that as of time of writing, `--env-file` does not support configuration of Uvicorn itself. Using this flag may require running `pip install python-dotenv` first.
:::

### Beyond defaults

If different than default ports are used for Wave server (<http://localhost:10101>) or Wave app (<http://localhost:8000>), it's necessary to properly set env variables:

* Wave server - `H2O_WAVE_LISTEN`.
* Wave app - `H2O_WAVE_APP_ADDRESS` and `H2O_WAVE_ADDRESS`.

### Deploying with HTTPS

Wave consists of 2 servers and both need to be configured separately.

* Wave server - `H2O_WAVE_TLS_CERT_FILE` and `H2O_WAVE_TLS_KEY_FILE` environment variables.
* Wave app - `uvicorn foo:main <other-params> --ssl-keyfile=<key file> --ssl-certfile=<cert file>`. See [uvicorn docs](https://www.uvicorn.org/deployment/#running-with-https).

HTTPS is all or nothing meaning either both server and app use TLS or none does.

### Deployment to separate machines

Although most people deploy their Wave server and Wave app to the same machine, it's not the only way. When deploying to separate machines, the main challenge is to make sure Wave server and Wave app can communicate properly.

For wave app machine, the following needs to be set:

* `H2O_WAVE_APP_ADDRESS` - the address of the Wave app machine that Wave server connects to. Defaults to `http://localhost:8000`. In real world, this would be something like `http://myapp1.mycompany.com:8000`.
* `H2O_WAVE_ADDRESS` - the address of the Wave server machine. Defaults to `http://localhost:10101`. In real world, this would be something like `http://myapp1server.mycompany.com:10101`.
* `--host 0.0.0.0` - Uvicorn exposes `localhost` by default, which would only listen for local network requests. `0.0.0.0` tells it to listen on all addresses.

:::tip
Do not specify addresses with `https` protocol if you haven't configured Wave server and Wave app to use TLS.
:::

## AWS EC2

See a step-by-step [blog post](https://medium.com/@gfousas/deploy-a-wave-app-on-an-aws-ec2-instance-1fe508f36ef) by [Greg Fousas](https://github.com/fousasg).

## Azure

See a step-by-step [blog post](https://medium.com/@leteve.audrey/run-h2o-wave-app-with-azure-app-service-342d32a009f8) by [Audrey Leteve](https://github.com/audreyleteve).

## Hugging Face Spaces

See a step-by-step [blog post](https://medium.com/@unusualcode/deploy-a-wave-app-to-hugging-face-spaces-8b9a2bda5e46).

## Behind Nginx (reverse proxy)

Since Wave relies on websockets, the following configuration is necessary.

```conf
# Enable websockets.
# http://nginx.org/en/docs/http/websocket.html
map $http_upgrade $connection_upgrade {
    default upgrade;
    ''      close;
}

server {
    location / {
        proxy_http_version 1.1;
        ; Change to your wave server address.
        proxy_pass http://localhost:10101/;

        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $http_host;
        proxy_set_header X-Forwarded-Proto http;
        proxy_set_header X-NginX-Proxy true;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection $connection_upgrade;

        proxy_redirect off;
    }
}
```

Read more at [official Nginx docs](http://nginx.org/en/docs/http/websocket.html) or see an [example repo](https://github.com/mturoci/wave-nginx).
