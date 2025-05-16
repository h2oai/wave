---
title: Development
---

Wave scripts are plain Python programs. Wave apps are ASGI programs. You can develop, debug and test them from the command-line, from the Python REPL, or from your favorite text editor.

Both [PyCharm Community Edition](https://www.jetbrains.com/pycharm/download) and [Visual Studio Code](https://code.visualstudio.com/) are excellent for Python programming.

:::tip
At the time of writing, PyCharm's type-checking and error-detection is superior to Visual Studio Code's Python plugin.
:::

## Getting started

The simplest way to get started in either PyCharm or Visual Studio Code is the same:

1. Create a working directory.
2. Set up a Python [virtual environment](https://docs.python.org/3/tutorial/venv.html).
3. Install the `h2o-wave` package.
4. Open the directory in your IDE.

```shell
mkdir $HOME/wave-apps
cd $HOME/wave-apps
python3 -m venv venv
./venv/bin/pip install h2o-wave
```

### Using PyCharm

1. Launch PyCharm
2. Click "File" -> "Open...", then choose `$HOME/wave-apps`.
3. Right-click on `wave-apps` in the "Project" tree, then click "New" -> "Python File".
4. Enter a file name, say, `foo.py`.
5. Write some code (see sample below).
6. Right-click anywhere inside the file and choose "Run foo" or "Debug foo".

:::tip
To make Wave app development easier, we suggest installing our [PyCharm plugin](https://plugins.jetbrains.com/plugin/18530-h2o-wave). If you want to learn more about all of its features check out [this blog post](https://wave.h2o.ai/blog/h2o-wave-pycharm-plugin).
:::

### Using Visual Studio Code

1. Launch Visual Studio Code
2. Click "File" -> "Open...", then choose `$HOME/wave-apps`.
3. Click "File" -> "New File"; save the file as, say, `foo.py`.
4. You should now get a prompt asking if you want to install extensions for Python. Click "Install".
5. Write some code (see sample below).
6. Hit `Ctrl+F5` to run, or `F5` to debug.

:::tip
To make Wave app development easier, we suggest installing our [VSCode extension](https://marketplace.visualstudio.com/items?itemName=h2oai.h2o-wave). If you want to learn more about all of its features check out [this blog post](https://wave.h2o.ai/blog/h2o-wave-vscode-extension).
:::

## Debugging Apps

To debug Wave apps, set your IDE or editor's configuration to execute the command `python -m h2o_wave run --no-reload foo` instead of `python foo.py`.

:::tip
The command `wave run --no-reload foo` is equivalent to `python -m h2o_wave run --no-reload foo`.
:::

### Debug in PyCharm

- Open the "Run/Debug Configurations" dialog for your script.
- Under "Configuration", change the "Script path" dropdown to "Module name".
- Set "Module name" to `h2o_wave`.
- Set "Parameters" to `run foo` (assuming your app's source code is in `foo.py`)

### Debug in Visual Studio Code

- Run "Open launch.json" command (cmd + shift + P).
- Add the configuration listed below.
- Go to Debug pane, select your newly added config and run it to start debugging.

```json
{
  "name": "Debug Wave App",
  "type": "python",
  "request": "launch",
  // Path to your wave installation, usually inside virtual env.
  "program": "${workspaceFolder}/venv/bin/wave",
  // Path to python you are using, usually inside virtual env.
  "python": "${workspaceFolder}/venv/bin/python",
  "args": [
    "run",
    "app"
  ]
}
```

## Using OpenID Connect

You can set up a local [Keycloak](https://www.keycloak.org/) instance for developing apps that use OpenID Connect, OAuth 2.0, or SAML 2.0 for authentication, single sign-on, and so on.

### Run Keycloak

First, create a local directory to persist all the realms, clients, and users you'll be adding to Keycloak:

```sh
mkdir ~/.keycloak
```

Run Keycloak using Docker:

```sh
docker run \
  -p 8080:8080 \
  -e KEYCLOAK_ADMIN=admin \
  -e KEYCLOAK_ADMIN_PASSWORD=admin \
  --volume ~/.keycloak:/opt/jboss/keycloak/standalone/data \
  quay.io/keycloak/keycloak:21.0.1 \
  start-dev
```

Keycloak should now be running at http://localhost:8080/.

### Add a client

Next, create a *client* in Keycloak to represent our app:

- Go to Keycloak at http://localhost:8080/admin.
- Log in with username `admin`, password `admin`.
- In the top left, click on `Clients`
  - Click the `Create client` button to create a new client.
  - Set `Client ID` to `wave`.
  - Click "Next".
  - Change the "Client authentication" to `On` to change access type of the to confidential.
  - Click `Next`.
  - Set `Valid Redirect URIs` to `*` (never do this in production).
  - Click `Save`.
  - Click the `Credentials` tab.
  - Copy the `Client secret` field (e.g. `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`).

### Add test users

Next, add one or more users to Keycloak:

- In the top left, click on `Users`.
  - Click the `Add User` button to create a new user.
  - Set the `Username` field.
  - Click `Create`.
  - Go to the `Credentials` tab.
  - Click `Set password`.
  - Set the password fields.
  - Change `Temporary` to `Off`.
  - Click `Save`.

:::tip
You can also use admin user for logging in with credentials `admin/admin` if you just need a quick testing.
:::

### Point Wave to Keycloak

We're ready to use Keycloak now. Make sure you log out of Keycloak, otherwise you'll be logged in as `admin` when you access your Wave app!

Finally, start the Wave daemon with the following `-oidc-` command line arguments (use the client secret you copied above):

```
./waved \
    -oidc-client-id wave \
    -oidc-client-secret xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx \
    -oidc-redirect-url http://localhost:10101/_auth/callback \
    -oidc-provider-url http://localhost:8080/realms/master \
    -oidc-end-session-url http://localhost:8080/realms/master/protocol/openid-connect/logout

```

Now, when you launch and access your Wave app, you should see a OpenID prompt which you can use to log in one of the users you created in Keycloak.
