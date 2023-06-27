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
./waved -access-key-id <id> -access-key-secret <secret>
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
./waved -create-access-key -access-keychain /path/to/file.extension
```

The Wave server uses the keychain file to authenticate requests from apps and scripts. By default, it automatically loads the `.wave-keychain` file if present in the current working directory.

To make the Wave server use a specific keychain file, launch it like this:

```shell
./waved -access-keychain /path/to/file.extension
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
./waved -remove-access-key ENHL90KR2HZD6X2ZIYLZ
```

To remove a key from a keychain file located elsewhere, do this:

```shell
./waved -remove-access-key ENHL90KR2HZD6X2ZIYLZ -access-keychain /path/to/file.extension
```

## HTTPS

To enable HTTP over TLS to secure your Wave server, pass the following flags when starting the Wave server:

- `-tls-cert-file`: path to certificate file or using `H2O_WAVE_TLS_CERT_FILE` env variable.
- `-tls-key-file`: path to private key file or using `H2O_WAVE_TLS_KEY_FILE` env variable.

File paths need to be either absolute or relative to the Wave server (waved) location.

Once set, the Wave app needs to know it should talk to the Wave server via `https` and not `http` as it does by default. This can be set using `H2O_WAVE_ADDRESS="https://127.0.0.1:10101"` env variable when starting the Wave app.

### Self Signed Certificate

To enable TLS during development, use a self-signed certificate.

To create a private key and a self-signed certificate from scratch, use `openssl`:

```shell
openssl req \
   -newkey rsa:2048 -nodes -keyout domain.key \
   -x509 -days 365 -out domain.crt
```

The above command creates a 2048-bit private key (`domain.key`) and a self-signed x509 certificate (`domain.crt`) valid for 365 days.

## Single Sign On

Wave has built-in support for [OpenID Connect](https://openid.net/connect/).

To enable OpenID Connect, pass the following flags when starting the Wave server:

- `-oidc-provider-url`: The URL for authentication (the identity provider's URL).
- `-oidc-redirect-url`: The URL to redirect back to after authentication. This is typically `/_auth/callback` appended to the Wave server's address. For example, if the Wave server is running at `https://192.168.42.42:80`, set this to `https://192.168.42.42:80/_auth/callback`. If you're testing your app's authorization workflow during development and the Wave server is running at `http://localhost:10101`, you can set this argument to `http://localhost:10101/_auth/callback`. If you also specified the `-base-url` argument for Wave server, then make sure the redirect URL includes the base URL. For example, if the base URL is set to `/my/app/`, set the redirect URL to `https://192.168.42.42:80/my/app/_auth/callback`.
- `-oidc-client-id`: Client ID (refer to your identity provider's documentation).
- `-oidc-client-secret`:  Client secret (refer to your identity provider's documentation).
- `-oidc-end-session-url`: (Optional) URL to log out (refer to your identity provider's documentation). This flag is optional and might not be supported by your identity provider.
- `-oidc-scopes`: (Optional) Comma-separated scopes that will override defaults (`openid,profile`).
- `-oidc-skip-login`: (Optional) Don't show the built-in login form during OIDC authorization. Instead, navigate directly to the identity provider's login form.
- `-oidc-auth-url-params`: (Optional) Additional URL parameters to pass during OIDC authorization.

Once authenticated, you can access user's authentication and authorization information from your app using `q.auth` (see the [Auth](api/server#auth) class for details):

```py
from h2o_wave import Q, main, app

@app('/example')
async def serve(q: Q):
    print(q.auth.username)
    print(q.auth.access_token)
```

### Explicit token refresh

Note that access token is not refreshed automatically and it's not suited for long running jobs. The lifespan of a token depends on a provider settings but usually it's short. Access token is refreshed each time user performs an action i.e. the query handler `serve()` is called. However, if your UI is blocked (no user interacitons that could automatically refresh the token) and you are performing a long-running job, and still need fresh access token, you can call `ensure_fresh_token` function that refreshes and sets the token explicitly. Additionally, it also returns the access token if needed for async token providers.

```py
from h2o_wave import Q, main, app

@app('/example')
async def serve(q: Q):
    # Refreshes the token and makes it available in q.auth.access_token.
    new_access_token = await q.auth.ensure_fresh_token()
```

Synchronous version `ensure_fresh_token_sync` is also supported if your token provider is synchronous. However, using it is heavily discouraged due to its blocking nature - will make the Wave app super slow for all users, thus only recommended for throwaway, single user PoCs. ***Async version is the preferred choice*** to mitigate this.

### FAQ

- **I'm not sure what my oidc provider url is:** The openid connect configuration for any provider is made accessible through the `.well-known/openid-configuration` endpoint. The value of `-oidc-provider-url` must be the base url of your provider. For example, if the configuraton address is at `http://localhost:8080/realms/master/.well-known/openid-configuration`, then the provider url that you have to pass to wave is `http://localhost:8080/realms/master`. Do not use a trailing slash at the end of the provider url!
- **Do I have to implement the authenticaton callback myself?** No, the callback is handled by the wave server. As mentioned in the description for `-oidc-redirect-url` in the list above, the host part or the base-url suffix is what usually changes between deployment environments, so that's what you need to check for correctness.
- **The callback is working in my development environment but not in production, or vice versa:** Providers usually allow to register multiple callback URI's. Ensure that the correct and necessary callback URI's for all your deployments are registered in your provider's configuration (ergo, the value you use for `-oidc-redirect-url` is in the list of registered URI's). Otherwise, the redirect will fail with an error `The redirect URI included is not valid`.
- **My identity provider uses `http` but the authentication link points to `https` which makes the login fail:** This can happen for using a private deployment of an authentication provider where the custom setup might not match the expected setup of the authentication service (check the endpoints in your `.well-known/openid-configuration`). In general, when transferring private data, it should be encrypted by using methods like ssl or tsl. To solve this issue, you will need to check if the openid configuration of your provider can be customized, or [change the protocol](/docs/security#https) (HTTP/HTTPS) of your Wave server to match the one used by your provider.

## App Server API Access Keys

Access to a Wave app is controlled via [HTTP Basic Authentication](https://tools.ietf.org/html/rfc7617). The basic authentication username/password pair is automatically generated on app launch, and is visible only to the Wave server. You can manually override this behavior by setting the `$WAVE_APP_ACCESS_KEY_ID` / `$WAVE_APP_ACCESS_KEY_SECRET` environment variables (for development/testing only - not recommended in production).

## Additional HTTP Response Headers

You can make the Wave daemon include additional HTTP response headers by using the `-http-headers-file` command line argument to `waved`, pointing to a [MIME-formatted](https://en.wikipedia.org/wiki/MIME#MIME_header_fields) file.

[A sample file](https://github.com/h2oai/wave/blob/main/headers.txt) (make sure there's an empty line at the end):

```txt title="headers.txt"
X-Frame-Options: SAMEORIGIN
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block

```

## Accessing forwarded headers

It's possible to access the HTTP headers that were set on **websocket HTTP connection** request via `q.headers`. This might be useful in case built-in OIDC auth is not an option and you already have an existing, company-wide auth based on intercepting all the traffic and verifying if the requests are authenticated.

:::important
Since Wave is websocket-based, the headers retrieved do not come from the initial `GET index.html` request, but from the websocket `/_s/` one.
:::

For a more fine-grained control over which HTTP headers are forwarded or not, check the `H2O_WAVE_FORWARDED_HTTP_HEADERS` [configuration option](/docs/configuration#configuring-the-server).
