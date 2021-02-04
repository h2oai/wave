---
title: Security
---

## HTTPS

To enable HTTP over TLS to secure your Wave server, pass the following flags when starting the Wave server:

- `-tls-cert-file`: path to certificate file.
- `-tls-key-file`: path to private key file.

### Self Signed Certificate

To enable TLS during development, use a self-signed certificate.

To create a private key and a self-signed certificate from scratch, use `openssl`:

```
openssl req \
   -newkey rsa:2048 -nodes -keyout domain.key \
   -x509 -days 365 -out domain.crt
```

The above command creates a 2048-bit private key (`domain.key`) and a self-signed x509 certificate (`domain.crt`) valid for 365 days.

## Single Sign On

Wave has built-in support for [OpenID Connect](https://openid.net/connect/).

To enable OpenID Connect, pass the following flags when starting the Wave server:

- `-oidc-provider-url`: URL for authentication (the identity provider's URL).
- `-oidc-redirect-url`: URL to redirect to after authentication. It's the address of the current instance of the Wave server + `/_auth/callback` e.g.: `http://localhost:10101/_auth/callback`.
- `-oidc-end-session-url`: URL to log out (refer to your identity provider's documentation). This flag is optional and might not be supported by your identity provider.
- `-oidc-client-id`: Client ID (refer to your identity provider's documentation).
- `-oidc-client-secret`:  Client secret (refer to your identity provider's documentation).

Once authenticated, you can access user's authentication and authorization information from your app using `q.auth` (see the [Auth](api/server#auth) class for details):


```py
from h2o_wave import Q, main, app

@app('/example')
async def serve(q: Q):
    print(q.auth.username)
    print(q.auth.access_token)
```

:::caution
Note that access token is not refreshed automatically and it's not suited for long running jobs. The lifespan of a token
depends on a provider settings but usually it's short. Access token is refreshed each time user performs an action i.e.
the query handler `serve()` is called.
:::
