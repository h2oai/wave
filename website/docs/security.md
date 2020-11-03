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
- `-oidc-redirect-url`: URL to redirect to after authentication.
- `-oidc-end-session-url`: URL to log out (or sign out).
- `-oidc-client-id`: Client ID (refer to your identity provider's documentation).
- `-oidc-client-secret`:  Client secret (refer to your identity provider's documentation).

Once authenticated, you can access user's authentication and authorization information from your app using `q.auth` (see the [Auth](api/server#auth) class for details):


```py
from h2o_wave import Q, main, app

@app('/example')
async def serve(q: Q):
    print(q.auth.username)
    print(q.auth.subject)
```