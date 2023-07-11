---
title: Configuration
---

## Configuring the server

Wave allows starting Wave server in 2 ways:

* via `wave run` command - this automatically starts Wave server (waved) under the hood, useful for development.
* via Wave server binary (waved) - useful during deployment or when you need to run your Wave server on a different machine than your app.

Wave can be configured via configuration (`.env`) file, environment variables or command line arguments with the following priority: `cmd arg > env var > config > default`.

<!-- CREDIT: https://www.tablesgenerator.com/markdown_tables. -->

| ENV var or config (wave run or waved)  | CLI args (waved)                      | Description                                                                                                                                                                                                                                                                                                          |
|----------------------------------------|---------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| H2O_WAVE_ACCESS_KEY_ID                 | -access-key-id string                 | default API access key ID (default "access_key_id")                                                                                                                                                                                                                                                                  |
| H2O_WAVE_ACCESS_KEY_SECRET             | -access-key-secret string             | default API access key secret (default "access_key_secret")                                                                                                                                                                                                                                                          |
| H2O_WAVE_ACCESS_KEYCHAIN               | -access-keychain string               | path to file containing API access keys (default ".wave-keychain")                                                                                                                                                                                                                                                   |
|                                        | -compact string                       | compact AOF log                                                                                                                                                                                                                                                                                                      |
|                                        | -create-access-key                    | generate and add a new API access key ID and secret pair to the keychain                                                                                                                                                                                                                                             |
| H2O_WAVE_DATA_DIR                      | -data-dir string                      | directory to store site data (default "./data").                                                                                                                                                                                                                                                                     |
| H2O_WAVE_DEBUG [^1]                    | -debug                                | enable debug mode (profiling, inspection, etc.)                                                                                                                                                                                                                                                                      |
| H2O_WAVE_EDITABLE [^1]                 | -editable                             | allow users to edit web pages                                                                                                                                                                                                                                                                                        |
| H2O_WAVE_FORWARDED_HTTP_HEADERS        | -forwarded-http-headers string        | comma-separated list of case-insensitive HTTP header keys to forward to the Wave app from the browser WS connection. If not specified, defaults to '*' - all headers are allowed. If set to an empty string, no headers are forwarded.                                                                               |
| H2O_WAVE_HTTP_HEADERS_FILE             | -http-headers-file string             | path to a MIME-formatted file containing additional HTTP headers to add to responses from the server                                                                                                                                                                                                                 |
| H2O_WAVE_INIT                          | -init string                          | initialize site content from AOF log                                                                                                                                                                                                                                                                                 |
| H2O_WAVE_LISTEN                        | -listen string                        | listen on this address (default ":10101")                                                                                                                                                                                                                                                                            |
|                                        | -list-access-keys                     | list all the access key IDs in the keychain                                                                                                                                                                                                                                                                          |
| H2O_WAVE_BASE_URL                      | -base-url string                      | the base URL (path prefix) to be used for resolving relative URLs (e.g. /foo/ or /foo/bar/, without the host (default "/")                                                                                                                                                                                           |
| H2O_WAVE_MAX_CACHE_REQUEST_SIZE        | -max-cache-request-size string        | maximum allowed size of HTTP requests to the server cache (e.g. 5M or 5MB or 5MiB) (default "5M")                                                                                                                                                                                                                    |
| H2O_WAVE_MAX_PROXY_REQUEST_SIZE        | -max-proxy-request-size string        | maximum allowed size of proxied HTTP requests (e.g. 5M or 5MB or 5MiB) (default "5M")                                                                                                                                                                                                                                |
| H2O_WAVE_MAX_PROXY_RESPONSE_SIZE       | -max-proxy-response-size string       | maximum allowed size of proxied HTTP responses (e.g. 5M or 5MB or 5MiB) (default "5M")                                                                                                                                                                                                                               |
| H2O_WAVE_MAX_REQUEST_SIZE              | -max-request-size string              | maximum allowed size of HTTP requests to the server (e.g. 5M or 5MB or 5MiB) (default "5M")                                                                                                                                                                                                                          |
| H2O_WAVE_NO_STORE [^1]                 | -no-store                             | disable storage (scripts and multicast/broadcast apps will not work)                                                                                                                                                                                                                                                 |
| H2O_WAVE_NO_LOG [^1]                   | -no-log                               | disable AOF logging (connect/disconnect and diagnostic logging messages are not disabled)                                                                                                                                                                                                                            |
| H2O_WAVE_OIDC_AUTH_URL_PARAMS          | -oidc-auth-url-params string          | additional URL parameters to pass during OIDC authorization, in the format "key:value", comma-separated, e.g. "foo:bar,qux:42"                                                                                                                                                                                       |
| H2O_WAVE_OIDC_CLIENT_ID                | -oidc-client-id string                | OIDC client ID                                                                                                                                                                                                                                                                                                       |
| H2O_WAVE_OIDC_CLIENT_SECRET            | -oidc-client-secret string            | OIDC client secret                                                                                                                                                                                                                                                                                                   |
| H2O_WAVE_OIDC_END_SESSION_URL          | -oidc-end-session-url string          | OIDC end session URL                                                                                                                                                                                                                                                                                                 |
| H2O_WAVE_OIDC_PROVIDER_URL             | -oidc-provider-url string             | OIDC provider URL                                                                                                                                                                                                                                                                                                    |
| H2O_WAVE_OIDC_REDIRECT_URL             | -oidc-redirect-url string             | OIDC redirect URL                                                                                                                                                                                                                                                                                                    |
| H2O_WAVE_OIDC_POST_LOGOUT_REDIRECT_URL | -oidc-post-logout-redirect-url string | OIDC post logout redirect URL                                                                                                                                                                                                                                                                                        |
| H2O_WAVE_OIDC_SCOPES                   | -oidc-scopes                          | OIDC scopes separated by comma (default "openid,profile")                                                                                                                                                                                                                                                            |
| H2O_WAVE_OIDC_SKIP_LOGIN [^1]          | -oidc-skip-login                      | don't show the built -in login form during OIDC authorization                                                                                                                                                                                                                                                        |
| H2O_WAVE_PRIVATE_DIR [^2]              | -private-dir value                    | additional directory to serve files from (authenticated users only), in the format "[url-path]@[filesystem-path]", e.g. "/public/files/@/some/local/path" will host /some/local/path/foo.txt at /public/files/foo.txt; multiple directory mappings allowed; paths need to be relative to Wave server binary location |
| H2O_WAVE_PUBLIC_DIR [^2]               | -public-dir value                     | additional directory to serve files from, in the format "[url-path]@[filesystem-path]", e.g. "/public/files/@/some/local/path" will host /some/local/path/foo.txt at /public/files/foo.txt; multiple directory mappings allowed; paths need to be relative to Wave server binary location                            |
| H2O_WAVE_PROXY [^1]                    | -proxy                                | enable HTTP proxy (for IDE / language server support only - not recommended for internet-facing websites)                                                                                                                                                                                                            |
|                                        | -remove-access-key string             | remove the specified API access key ID from the keychain                                                                                                                                                                                                                                                             |
| H2O_WAVE_SESSION_EXPIRY                | -session-expiry string                | session cookie lifetime duration (e.g. 1800s or 30m or 0.5h) (default "720h")                                                                                                                                                                                                                                        |
| H2O_WAVE_SESSION_INACTIVITY_TIMEOUT    | -session-inactivity-timeout string    | session inactivity timeout duration (e.g. 1800s or 30m or 0.5h) (default "30m")                                                                                                                                                                                                                                      |
| H2O_WAVE_TLS_CERT_FILE                 | -tls-cert-file string                 | path to certificate file (TLS only)                                                                                                                                                                                                                                                                                  |
| H2O_WAVE_TLS_KEY_FILE                  | -tls-key-file string                  | path to private key file (TLS only)                                                                                                                                                                                                                                                                                  |
| H2O_WAVE_NO_TLS_VERIFY [^1]            | -no-tls-verify                        | do not verify TLS certificates during external communication - DO NOT USE IN PRODUCTION                                                                                                                                                                                                                              |
|                                        | -version                              | print version and exit                                                                                                                                                                                                                                                                                               |
| H2O_WAVE_KEEP_APP_LIVE [^1]            | -keep-app-live                        | do not unregister unresponsive apps (default false)                                                                                                                                                                                                                                                                  |
| H2O_WAVE_WEB_DIR                       | -web-dir string                       | directory to serve web assets from (default "./www")                                                                                                                                                                                                                                                                 |
| H2O_WAVE_CONF                          | -conf string                          | path to a configuration file (default ".env")                                                                                                                                                                                                                                                                        |
[^1]: `1`, `t`, `true` to enable; `0`, `f`, `false` to disable (case insensitive).
[^2]: Use OS-specific path list separator to specify multiple arguments - `:` for Linux/OSX and `;` for Windows. For example, `H2O_WAVE_PUBLIC_DIR=/images/@./files/images:/downloads/@./files/downloads`.

### File paths

All the configuration options that expect a path as value (public/private dir, data dir etc.) need the path provided to be either absolute or relative to a directory where `waved` is stored.

Those that do not start `waved` manually (but use `wave run` instead) and would like to use relative paths need to know that `waved` is stored in their 'virtualenv' (venv) folder (when installed via `pip`). If the `venv` folder is within the project root, then all the paths relative to your project dir need to be prepended with `../` (up one directory).

### Supported size units (case insensitive)

* Exabyte: `E` / `EB` / `EIB`.
* Petabyte: `P` / `PB` / `PIB`.
* Terabyte: `T` / `TB` / `TIB`.
* Gigabyte: `G` / `GB` / `GIB`.
* Megabyte: `M` / `MB` / `MIB`.
* Kilobyte: `K` / `KB` / `KIB`.
* Byte: `B`

### Suported time units

* Nanosecond: `ns`.
* Microsecond: `us` (or `µs`).
* Milisecond `ms`.
* Second: `s`.
* Minute: `m`.
* Hour: `h`.

### Public/Private dirs

Wave server serves whole directories as they are. This means that these directories are listable by default. If you wish to turn off this behavior, simply put an empty file called `index.html` into the folder you wish to not list.

### TLS verification

During development, you might want to test out TLS encryption, e.g. communication between Wave server and Keycloak. The easiest thing to do is to generate a self-signed certificate. However, Wave server verifies certificates for all communication by default, thus would throw an error for a self-signed one. ***FOR DEVELOPMENT PURPOSES ONLY***, it's possible to turn off the check using either `H2O_WAVE_NO_TLS_VERIFY` environment variable or `no-tls-verify` parameter.

:::warning
**Disabling TLS verification is a security risk.** Make sure TLS is not disabled in production environments.
:::

## Configuring your app

Your Wave application is an ASGI server. When you run your app during development, the app server runs at <http://127.0.0.1:8000/> by default (localhost, port 8000), and assumes that your Wave server is running at <http://127.0.0.1:10101/> (localhost, port 10101). The `wave run` command automatically picks another available port if `8000` is not available.

The Wave server and apps communicate with each other using RPC over persistent HTTP connections.

For production deployments, you'll want to configure which port your app listens to, how it can access the Wave server, and how the Wave server can access your app.

You can use the following environment variables to configure your app's server's behavior:

### H2O_WAVE_APP_ADDRESS

The public host/port of the app server. Defaults to `http://127.0.0.1:8000`. Set this variable if you are running your Wave server and your app on different machines or containers.

### H2O_WAVE_APP_MODE

The [realtime sync mode](realtime.md) of the app server. One of `unicast` (default), `multicast`, or `broadcast`.

### H2O_WAVE_ADDRESS

The public host/port of the Wave server. Defaults to `http://127.0.0.1:10101`. Set this variable if you are running the Wave server on a remote machine or container. Another common usage for this var is changing the app port together with `H2O_WAVE_LISTEN`.

### H2O_WAVE_CONNECTION_TIMEOUT

The number of seconds to attempt to connect to the Wave server before giving up.

### H2O_WAVE_ACCESS_KEY_ID

The API access key ID to use when communicating with the Wave server.

### H2O_WAVE_ACCESS_KEY_SECRET

The API access key secret to use when communicating with the Wave server.

### H2O_WAVE_APP_ACCESS_KEY_ID

The API access key ID to use when communicating with the app server. Automatically generated if not specfied.

### H2O_WAVE_APP_ACCESS_KEY_SECRET

The API access key secret to use when communicating with the app server. Automatically generated if not specified.

### H2O_WAVE_INTERNAL_ADDRESS

:::caution Deprecated
This environment variable will be removed in v1.0.
:::

The local host/port on which the app server should listen. Defaults to `http://127.0.0.1:8000`. For example, if you want your app to listen on a specific port, execute your app as follows (replace `66666` with a port number of your choice):

```sh
H2O_WAVE_INTERNAL_ADDRESS=ws://127.0.0.1:66666 ./venv/bin/python my_app.py
```

### H2O_WAVE_EXTERNAL_ADDRESS

:::caution Deprecated
Specify `H2O_WAVE_APP_ADDRESS` instead.
:::

The public host/port of the app server. Defaults to `http://127.0.0.1:8000`. Set this variable if you are running your Wave server and your app on different machines or containers.

### H2O_WAVE_CHECKPOINT_DIR

The directory to save/load application and session state. Enables checkpointing. If set, the app saves the contents of `q.app` and `q.user` before exiting. When restarted, the contents of `q.app` and `q.user` are restored. The directory is automatically created if it does not exist.

You can use checkpointing as a simple way to save/load your app's data while prototyping.

The checkpoint file is named `h2o_wave.checkpoint`, and is serialized using Python's [pickle](https://docs.python.org/3/library/pickle.html) protocol. Due to the nature of the `pickle` format, checkpointing is only guaranteed to work if the Python version and the versions of your app's dependencies are a perfect match, down to the patch version. In other words, do not expect checkpointing to work if an app is restarted using a newer/older Python version or a newer/older package. If you use checkpointing, it is recommended that you explicitly use `==` to set the `major.minor.patch` version of every package in your app's `requirements.txt` or `setup.py`.

### H2O_WAVE_NO_AUTOSTART

Disable/enable Wave server boot during `wave run`. Defaults to `false`. Available values: `1`, `t`, `true` to disable autostart; `0`, `f`, `false` to enable autostart (case insensitive). Same as calling `wave run --no-autostart`.

### H2O_WAVE_BASE_URL

The base URL (path prefix) to be used for resolving relative URLs (e.g. /foo/ or /foo/bar/, without the host (default "/"). If you run your Wave server (waved) and Wave app separately, it's necessary to set this env variable for both.

### H2O_WAVE_NO_COPY_UPLOAD

If the Wave server and Wave app run on the same machine, `q.site.upload()` will copy files instead of using HTTP requests. This is done for performance reasons (avoids serialization overheads). To disable this optimization and force HTTP requests every time, set `H2O_WAVE_NO_COPY_UPLOAD` to `1` or `t` or `true`.

### H2O_WAVE_WAVED_DIR

Provides the location of the Wave server's root directory to the Wave app, if both the server and the app are running on the same machine. Useful for performance optimizations during file uploads. Makes `q.site.upload()` copy files instead of using HTTP requests.

### H2O_WAVE_RELOAD_EXCLUDE

Excludes certain files or directories from being watched for app reload. Only relative paths are allowed and requires [watchfiles](https://pypi.org/project/watchfiles/) to be installed. See [Uvicorn docs](https://www.uvicorn.org/settings/#reloading-with-watchfiles).

Multiple values are supported. Use OS path separator (`:` for Unix and `;` for Windows) as a delimiter. E.g. `H2O_WAVE_RELOAD_EXCLUDE=tmp_dir1/*.py:tmp_dir2/*.txt`.

## Web Analytics

You can configure your app's web pages to send basic usage information to a third-party web analytics or tracking site. This lets you measure and analyze how users are interacting with various parts of your app.

By default, Wave apps do not load any third-party trackers or capture usage data. Third-party trackers have to be enabled explicitly by the application's author, and are loaded on-demand.

Once enabled, your app's UI will send events every time the user performs some kind of action that triggers a request from the browser to your app. Only two kinds of information are sent to the third-party trackers:

* The names of the elements that were possibly interacted with (and not values). For example, if a button named `foo` was clicked on, the value `foo=true` is tracked.
* The hash part of the URL, if any. For example if the page `/foo/bar` was navigated to, the value `#=/foo/bar` is tracked.

### Google Analytics

To enable usage tracking via Google Analytics, create and set a `ui.tracker()` on your page's meta card, with the `id` set to the measurement ID of your web property.

```py {2}
q.page['meta'] = ui.meta_card('',
    tracker=ui.tracker(type=ui.TrackerType.GA, id='G-XXXXXXXXXX')
)
```

## FAQ

### How to start a Wave app on a different port?

You first need to set `H2O_WAVE_LISTEN` env variable, which is a string prefixed with `:` to make your Wave server expose the port you want. Afterwards set `H2O_WAVE_ADDRESS='http://127.0.0.1:10102'` to tell your Wave app where it should connect to.

```sh
H2O_WAVE_LISTEN=":10102" H2O_WAVE_ADDRESS='http://127.0.0.1:10102' wave run app.py
```
