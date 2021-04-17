# Protocol

## Wire Protocol

As of 2021, the messages are JSON-encoded, but this will change to a binary format in a future release.

(TODO: Document protocol).

Refer to [protocol.go](protocol.go).

## App Server Protocol

A Wave app is a HTTP server, hereafter referred to as the "app server".

At run time, messages between the browser and the Wave server are exchanged via web sockets.
Messages between the Wave server and the app server are exchanged via HTTP requests.

```

                                       HTTP
  ┌──────────┐           ┌──────────┐ request   ┌──────────┐
  │          │           │          ├───────────►          │
  │  Browser │◄─────────►│   Wave   │           │   App    │
  │          │    Web    │  Server  │           │  Server  │
  │          │   Socket  │          ◄───────────┤          │
  └──────────┘           └──────────┘   HTTP    └──────────┘
                                       request

```


Relevant environment variables:

- `WAVE_ADDRESS`: The `protocol://ip:port` of the Wave server as visible from the app server.
- `WAVE_APP_ADDRESS`: The `protocol://ip:port` of the app server as visible from the Wave server.
- `WAVE_APP_MODE`: The sync mode of the app, one of `unicast`, `multicast` or `broadcast`.
- `WAVE_ACCESS_KEY_ID`: The Wave server API access key ID, typically a cryptographically random string.
- `WAVE_ACCESS_KEY_SECRET`: The Wave server API access key secret, typically a cryptographically random string.
- `WAVE_APP_ACCESS_KEY_ID`: The app server API access key ID, typically a cryptographically random string.
- `WAVE_APP_ACCESS_KEY_SECRET`: The app server API access key secret, typically a cryptographically random string.

### Startup

On app launch, the app registers itself with the Wave server by sending a `POST` request to `$WAVE_ADDRESS` (with `Content-Type: application/json`).

```
{
  "register_app": {
    "mode": "$WAVE_APP_MODE",
    "address": "$WAVE_APP_ADDRESS"
    "key_id": "$WAVE_APP_ACCESS_KEY_ID",
    "key_secret": "$WAVE_APP_ACCESS_KEY_SECRET",
    "route": "/foo",
  }
}
```

The `key_id` and `key_secret` are automatically generated at startup if `$WAVE_APP_ACCESS_KEY_ID` or `$WAVE_APP_ACCESS_KEY_SECRET` are empty.

### Accepting requests

The Wave server now starts forwarding browser requests from the Wave server's `/foo` to the app server's `/`. Consequently, the app framework requires exactly one HTTP handler, listening to `POST` requests at `/`.

On receiving a request, the app server:
1. Verifies if the credentials in the request's basic-authentication header match `$WAVE_APP_ACCESS_KEY_ID` and `$WAVE_APP_ACCESS_KEY_SECRET`.
2. Captures the headers and body of the HTTP request.
3. Responds with a plain-text empty-string (200 status code). Note that the Wave server ignores responses.

### Processing requests

The HTTP request body is UTF-8 encoded JSON.  The body is parsed to get the `args` dictionary. Additionally, if the `args` dictionary contains a empty-string key, it is removed from the `args` dictionary and treated as the `events` dictionary.

The client and authentication details are sent as headers:
- `Wave-Client-ID`: Client ID (each browser tab has a unique client ID).
- `Wave-Subject-ID`: OIDC subject ID (each user has a unique subject ID).
- `Wave-Username`: OIDC preferred username.
- `Wave-Access-Token`: OIDC access token.
- `Wave-Refresh-Token`: OIDC refresh token.

At this point, a `page` instance is initialized for the app. The location of the page depends on `$WAVE_APP_MODE`:
- `unicast`: `/client_id` (the client ID, which uniquely identifies the browser tab).
- `multicast`: `/subject` (the OIDC subject id, which uniquely identifies the user).
- `broadcast`: `/foo` (the route the app is responding to).

Finally, all the above items (args, events, headers, page) are passed on to the app for further processing.

### Shutdown

On app termination, the app de-registers itself from the Wave server by sending a `POST` request to `$WAVE_ADDRESS` (with `Content-Type: application/json`).

```
{
  "unregister_app": {
    "route": "/foo"
  }
}
```

