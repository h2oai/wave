# Configuration

## Q Server

Execute `qd -help` to see all available command line options:

```
$ ./qd -help
Usage of ./qd:
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
        listen on this address (default ":55555")
  -tls-cert-file string
        path to certificate file (TLS only)
  -tls-key-file string
        path to private key file (TLS only)
  -version
        print version and exit
  -web-dir string
        directory to serve web assets from (default "./www")
```

## Python App

You can use the following environment variables to control your app's server:

- `H2O_Q_INTERNAL_ADDRESS`: The local host/port on which the app server should listen. Defaults to `ws://127.0.0.1:0` (automatically picks an available port). For example, if you want your app to listen on a specific port, execute your app using `H2O_Q_INTERNAL_ADDRESS=ws://127.0.0.1:66666 ./venv/bin/python my_app.py` (replace `66666` with a port number of your choice).
- `H2O_Q_EXTERNAL_ADDRESS`: The public host/port of the app server. Defaults to `ws://127.0.0.1:0`. Set this variable if you are running your Q server and your app on different machine or containers.
- `H2O_Q_ADDRESS`: The public host/port of the Q server. Set this variable if you are running the Q server on a remote machine or container.
- `H2O_Q_ACCESS_KEY_ID`: The API access key ID to use for communicating with the Q server.
- `H2O_Q_ACCESS_KEY_SECRET`: The API access key secret to use for communicating with the Q server.

