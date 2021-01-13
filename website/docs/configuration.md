---
title: Configuration
---

## Configuring the server

### Command line options
Execute `waved -help` to see all available command line options:

```
$ ./waved -help
Usage of ./waved:
  -access-key-id string
    	default access key ID (default "access_key_id")
  -access-key-secret string
    	default access key secret (default "access_key_secret")
  -compact string
    	compact AOF log
  -data-dir string
    	directory to store site data (default "./data")
  -debug
    	enable debug mode (profiling, inspection, etc.)
  -init string
    	initialize site content from AOF log
  -listen string
    	listen on this address (default ":10101")
  -oidc-client-id string
    	OIDC client ID
  -oidc-client-secret string
    	OIDC client secret
  -oidc-end-session-url string
    	OIDC end session URL
  -oidc-provider-url string
    	OIDC provider URL
  -oidc-redirect-url string
    	OIDC redirect URL
  -tls-cert-file string
    	path to certificate file (TLS only)
  -tls-key-file string
    	path to private key file (TLS only)
  -version
    	print version and exit
  -web-dir string
    	directory to serve web assets from (default "./www")
```

## Configuring your app

Your Wave application is an ASGI server. When you run your app during development, the app server runs at http://127.0.0.1:8000/ by default (localhost, port 8000), and assumes that your Wave server is running at http://127.0.0.1:10101/ (localhost, port 10101). The `wave run` command automatically picks another available port if `8000` is not available. 

The Wave server and apps communicate with each other using RPC over persistent HTTP connections.

For production deployments, you'll want to configure which port your app listens to, how it can access the Wave server, and how the Wave server can access your app.

You can use the following environment variables to configure your app's server's behavior:

### H2O_WAVE_APP_ADDRESS
The public host/port of the app server. Defaults to `http://127.0.0.1:8000`. Set this variable if you are running your Wave server and your app on different machines or containers.

### H2O_WAVE_ADDRESS
The public host/port of the Wave server. Defaults to `http://127.0.0.1:10101`. Set this variable if you are running the Wave server on a remote machine or container.

### H2O_WAVE_ACCESS_KEY_ID
The API access key ID to use for communicating with the Wave server.

### H2O_WAVE_ACCESS_KEY_SECRET
The API access key secret to use for communicating with the Wave server.

### H2O_WAVE_INTERNAL_ADDRESS

:::caution Deprecated
This environment variable will be removed in v1.0.
:::

The local host/port on which the app server should listen. Defaults to `http://127.0.0.1:8000`. For example, if you want your app to listen on a specific port, execute your app as follows (replace `66666` with a port number of your choice):
```
$ H2O_WAVE_INTERNAL_ADDRESS=ws://127.0.0.1:66666 ./venv/bin/python my_app.py
```


### H2O_WAVE_EXTERNAL_ADDRESS

:::caution Deprecated
Specify `H2O_WAVE_APP_ADDRESS` instead.
:::

The public host/port of the app server. Defaults to `http://127.0.0.1:8000`. Set this variable if you are running your Wave server and your app on different machines or containers.
