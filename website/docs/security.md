---
title: Security
---

## Wave Server API Access Keys

Wave apps and scripts access the Wave server using access keys via [HTTP Basic Authentication](https://tools.ietf.org/html/rfc7617).

An application access key is a pair of strings: ID and Secret. 

### Development

The default ID and secret are the strings `access_key_id`/`access_key_secret`, which are set for development convenience, but are obviously not secure.

During development, you can change the default ID and secret when you start the Wave server like this:

```shell
$ ./waved -access-key-id <id> -access-key-secret <secret>
```

If you change the ID and secret, you'll need to ensure that your app or script uses the new credentials by setting the `H2O_WAVE_ACCESS_KEY_ID` and `H2O_WAVE_ACCESS_KEY_SECRET` environment variables accordingly.

### Production

For production deployments, you should generate cryptographically secure random ID/secret pairs like this:

```shell
$ ./waved -create-access-key

SUCCESS!

Make sure to copy your new access key ID and secret now.
You won't be able to see it again!

H2O_WAVE_ACCESS_KEY_ID=ENHL90KR2HZD6X2ZIYLZ
H2O_WAVE_ACCESS_KEY_SECRET=dxQPcenUJJgLes8rxkp7rUj02t2y3hCqBteyvY2I

Your key was also added to the keychain located at
.wave-keychain

```

The above command also stores the credentials in a file named `.wave-keychain` in the current working directory. The file format is similar to a [.htpasswd](https://en.wikipedia.org/wiki/.htpasswd) file, but always uses [bcrypt](https://en.wikipedia.org/wiki/Bcrypt) hashes. Note that the access key secret displayed on the console is not stored anywhere, and cannot be recovered. If you lose the secret, simply generate a new one and reconfigure your app to use the new secret.

You can also make the `-create-access-key` command use a keychain file located elsewhere, like this:

```shell
$ ./waved -create-access-key -access-keychain /path/to/file.extension
```

The Wave server uses the keychain file to authenticate requests from apps and scripts. By default, it automatically loads the `.wave-keychain` file if present in the current working directory.

To make the Wave server use a specific keychain file, launch it like this:

```shell
$ ./waved -access-keychain /path/to/file.extension
```

To view a sorted list of all the keys in a keychain file, use `-list-access-keys`, like this:

```shell
$ ./waved -list-access-keys
ENHL90KR2HZD6X2ZIYLZ
IDID44ZK0L7NG8NDD7IC
N8CK63JT6OZIOX2SWALR
PCBTV5TNQKOSAU2EBD6D
VAKQY6QJN3RRQDU5LD0E
```

To remove a key from a keychain file, use `-remove-access-key`, like this:

```shell
$ ./waved -remove-access-key ENHL90KR2HZD6X2ZIYLZ
```

To remove a key from a keychain file located elsewhere, do this:

```shell
$ ./waved -remove-access-key ENHL90KR2HZD6X2ZIYLZ -access-keychain /path/to/file.extension
```

## HTTPS

To enable HTTP over TLS to secure your Wave server, pass the following flags when starting the Wave server:

- `-tls-cert-file`: path to certificate file.
- `-tls-key-file`: path to private key file.

### Self Signed Certificate

To enable TLS during development, use a self-signed certificate.

To create a private key and a self-signed certificate from scratch, use `openssl`:

```
$ openssl req \
   -newkey rsa:2048 -nodes -keyout domain.key \
   -x509 -days 365 -out domain.crt
```

The above command creates a 2048-bit private key (`domain.key`) and a self-signed x509 certificate (`domain.crt`) valid for 365 days.

## Single Sign On

Wave has built-in support for [OpenID Connect](https://openid.net/connect/).

To enable OpenID Connect, pass the following flags when starting the Wave server:

- `-oidc-provider-url`: The URL for authentication (the identity provider's URL).
- `-oidc-redirect-url`: The URL to redirect back to after authentication. This is typically `/_auth/callback` appended to the Wave server's address. For example, if the Wave server is running at `https://192.168.42.42:80`, set this to `https://192.168.42.42:80/_auth/callback`. If you're testing your app's authorization workflow during development and the Wave server is running at `http://localhost:10101`, you can set this argument to `http://localhost:10101/_auth/callback`.
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



## App Server API Access Keys

Access to a Wave app is controlled via [HTTP Basic Authentication](https://tools.ietf.org/html/rfc7617). The basic authentication username/password pair is automatically generated on app launch, and is visible only to the Wave server. You can manually override this behavior by setting the `$WAVE_APP_ACCESS_KEY_ID` / `$WAVE_APP_ACCESS_KEY_SECRET` environment variables (for development/testing only - not recommended in production).