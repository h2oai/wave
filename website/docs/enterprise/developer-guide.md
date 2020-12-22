---
title: Developer Guide
slug: /enterprise/developer-guide
---


## App Bundle Structure

Each app has to be bundled as a zip archive (commonly used with suffix `.wave`)
consisting of:

* `app.toml` - required; the platform configuration file
* `static/` - static asset directory, including the app icon (a png file starting with `icon`)
  and screenshots (files starting with `screenshot`)
* `requirements.txt` - pip-managed dependencies of the app (can contain references to `.whl` files
  included in the `.wave` using paths relative to the archive root)
* `packages.txt` - OS-managed dependencies of the app
* app source code

You can quickly create a `.wave` archive by running `h2o bundle` in your app git repository
(see the [CLI](#cli) section)

### app.toml

Each app archive has to contain a `app.toml` configuration file in the [TOML](https://toml.io/en/) format,
placed in the root of the `.wave` archive, example:

```toml
[App]
Name = "ai.h2o.wave.my-app"
Version = "0.0.1"
Title = "My awesome app"
Description = "This is my awesome app"
LongDescription = "LongDescription.md"
Category = "Other"
Keywords = ["awesome"]

[Runtime]
Module = "app.run"
VolumeMount = "/data"
VolumeSize = "1Gi"
ResourceVolumeSize = "2Gi"
MemoryLimit = "500Mi"
MemoryReservation = "400Mi"
EnableOIDC = false

[[Env]]
Name = "ENVIRONMENT_VARIABLE_NAME"
Secret = "SecretName"
SecretKey = "SecretKeyName"

[[Env]]
Name = "ANOTHER_ENVIRONMENT_VARIABLE_NAME"
Value = "some value"

[[File]]
Path = "some/path.file"
Secret = "FileSecretName"
SecretKey = "FileSecretKeyName"

[[File]]
Path = "/another/path.file"
Value = '''
some
string
'''
```

**Required attributes**:

* `App`
  * `Name` - a machine-oriented unique identifier of the app (links different app versions together)
  * `Version` - a <https://semver.org> version of the app
* `Runtime`
  * `Module` - the name of the main Python module of the app, i.e., the app should be started
      via `python3 -m $module_name`

**Optional attributes**:

* `App`
  * `Title` - a human-oriented name of the app for presentation in UI/CLI; string
  * `Description` - a single-line description of the app for presentation in UI/CLI; string
  * `LongDescription` - a path to a file, relative to the archive root, containing additional
        multi-line markdown description of the app; string;
        although there is no actual restriction of the Markdown format, it is recommended to limit
        it to bullet-point lists (`*`), H3 headings (`###`), and hyperlinks (`[]()`)
  * `Category` - category for organizing apps into groups, string
      (UI recognizes `All`, `Data Science`, `Financial Services`, `Healthcare`, `Insurance`,
      `Manufacturing`, `Marketing`, `Retail`, `Sales`, `Telecommunications`, and `Other`)
  * `Keywords` - keywords for search in the UI/CLI, list of strings
* `Runtime`
  * `VolumeMount` and `VolumeSize` - request for a volume to persist app instance data across
       restarts, `VolumeMount` has to be an absolute path, `VolumeSize` needs to conform to the
       [k8s resource model](https://github.com/fabric8io/kansible/blob/master/vendor/k8s.io/kubernetes/docs/design/resources.md#resource-quantities).
  * `ResourceVolumeSize` - request for a volume to persist internal app resources (such as Python venv)
         across restarts, only recommended for production-quality apps with sizeable resources due
         to cluster node limits, needs to conform to the
         [k8s resource model](https://github.com/fabric8io/kansible/blob/master/vendor/k8s.io/kubernetes/docs/design/resources.md#resource-quantities).
  * `MemoryLimit` and `MemoryReservation` - memory requirements for an instance of the app
      (default to service-wide settings managed by Admins); be conservative with these limits;
      `MemoryLimit` is a hard limit on the maximum amount of memory an instance can use before it is OOM-killed;
      `MemoryReservation` is how much memory is required to schedule an instance of the app.
  * `EnableOIDC` - Enable wave to be setup with OIDC authorization giving access to the user's authentication and authorization information from your app (see [Security](security.md/#single-sign-on) for details).
* `Env` - request for a literal value/secret to be injected into an instance at startup-time as an Env variable;
  repeated; see [Utilizing Secrets](#utilizing-secrets).
  * `Name` - name of the Env variable to the injected into the Python process;
    names prefixed with `H2O_CLOUD` are disallowed.
  * `Secret` - name of the shared secret to use; each secret can contain multiple key-value pairs;
    cannot be used together with `Value`.
  * `SecretKey` - name of the key within the secret to use; cannot be used together with `Value`.
  * `Value` - the literal value of the Env variable; cannot be used together with `Secret`/`SecretKey`.
* `File` - request for a literal value/secret to be injected into an instance at startup-time as a file;
  repeated; see [Utilizing Secrets](#utilizing-secrets).
  * `Path` - path to inject the file to; relative path means relative to the directory with the app code
    as determined by the platform; path dir cannot be `/` or `.` (only subdirs are allowed);
    path dir has to be unique across all other `File` configurations; path dir `/resources` is
    disallowed.
  * `Secret` - name of the shared secret to use; each secret can contain multiple key-value pairs;
    cannot be used together with `Value`.
  * `SecretKey` - name of the key within the secret to use; cannot be used together with `Value`.
  * `Value` - the literal value of the file; cannot be used together with `Secret`/`SecretKey`.

## Runtime Environment

The platform sets the app instance runtime environment, i.e., OS, Wave/Python version, location of the app code/venv, etc.

Developers can specify the pip-managed dependencies of the app via standard `requirements.txt` (can contain
references to `.whl` files included in the `.wave` using paths relative to the archive root)

Developers can also specify the OS-managed dependencies of the app via `packages.txt` in a format
similar to `requirements.txt`: one package name per line.
These will be installed as given using the native package manager of the platform OS
(e.g., `apt-get install` for Debian).

Developers can further customize the runtime environment by [Utilizing Secrets](#utilizing-secrets).

:::note
At this moment, the platform does not provide any provisions for developers to customize the OS,
Python, or Wave versions.

We are actively working on improving this.
:::

## CLI

As a developer, you will need the `h2o` binary to interact with the platform.

### Configuring the CLI

First you need to configure the CLI by running `h2o config setup` so that it knows how to talk
to a particular platform deployment.

Be aware, currently the CLI launches a browser to complete the user authentication, and due to this
we currently unable to support remote use of the CLI over SSH without provisions for X forwarding.

### Listing existing apps

The `h2o app list -a` command will list all apps available for launch.

```sh
$ h2o app list -a
ID                                    TITLE                        OWNER            CREATED CATEGORY      VISIBILITY    TAGS
abc543210-0000-0000-0000-1234567890ab Peak 0.1.1                   user1@h2o.ai     18d     Healthcare    ALL_USERS     Beta
bcd543210-1111-1111-1111-0123456789ab Tour 0.0.15-20200922162859   user2@h2o.ai     20d     Other         ALL_USERS
...
```

### Launching existing apps

To launch an app, the `h2o app run <appId>` command can be used to launch a new instance of that app.
The `-v` flag can be used with `app run` to specify app instance visibility settings.

```sh
$ h2o app run bcd543210-1111-1111-1111-0123456789ab
ID  22222222-3333-4444-5555-666666666666
URL https://22222222-3333-4444-5555-666666666666.wave.h2o.ai
```

### Publishing an app for others to see and launch

Just run `h2o bundle import` in your app git repository. This will automatically package your
current directory into a `.wave` package and import it into the platform.

If you set the visibility to `ALL_USERS` (via the `-v` flag), others will be able use `h2o app run`
or the UI to launch the app.

Note: the name-version combination from your `app.toml` has to be unique and the platform will reject
the request if such combination already exists. Therefore, you need to update the version in `app.toml`
before each run.

```sh
$ h2o bundle import -v ALL_USERS
ID              bcd543210-1111-1111-1111-0123456789ab
Title           Peak
Version         0.1.2
Category        Healthcare
Created At      2020-10-13 06:28:03.050226 +0000 UTC
Updated At      2020-10-13 06:28:03.050226 +0000 UTC
Owner           user1@h2o.ai
Visibility      ALL_USERS
Description     Forecast of COVID-19 spread
Tags
```

### Running an app under development

Just run `h2o bundle deploy` in your app git repository. This will automatically package your
current directory into a `.wave` package, import it into the platform, and run it.

In the output you will be able to find a URL where you can reach the instance, or visit
the "My Instances" in the UI.

Note: the CLI will auto-generate the version so that you can keep executing this without worrying about
version conflicts, just don't forget to clean up old instances/versions.

```sh
$ h2o bundle deploy
ID              bcd543210-1111-1111-1111-0123456789ab
Title           Peak
Version         0.1.2-20201013062803
Category        Healthcare
Created At      2020-10-13 06:28:03.050226 +0000 UTC
Updated At      2020-10-13 06:28:03.050226 +0000 UTC
Owner           user1@h2o.ai
Visibility      PRIVATE
Description     Forecast of COVID-19 spread
Tags
ID  22222222-3333-4444-5555-666666666666
URL https://22222222-3333-4444-5555-666666666666.wave.h2o.ai
```

### Getting the logs of a running app instance

Just run `h2o instance logs`, use the flag `-f` (`--follow`) to tail the log.

```sh
$ h2o instance logs c22222222-3333-4444-5555-666666666666
...
2020/10/27 16:16:34 #
2020/10/27 16:16:34 # ┌─────────────────────────┐
2020/10/27 16:16:34 # │  ┌    ┌ ┌──┐ ┌  ┌ ┌──┐  │ H2O Wave
2020/10/27 16:16:34 # │  │ ┌──┘ │──│ │  │ └┐    │ (version) (build)
2020/10/27 16:16:34 # │  └─┘    ┘  ┘ └──┘  └─┘  │ © 2020 H2O.ai, Inc.
2020/10/27 16:16:34 # └─────────────────────────┘
2020/10/27 16:16:34 #
2020/10/27 16:16:34 # {"address":":10101","t":"listen","webroot":"/wave/www"}
2020/10/27 16:16:34 # {"host":"ws://127.0.0.1:10102","route":"/","t":"relay"}
...
```

### Running the app in cloud-like environment locally

Just run `h2o exec`. This will bundle the app in a temporary `.wave` and launch it locally
using our platform docker image.

Note that this requires that you have docker installed and that you have access to the docker image.

Then navigate to `http://localhost:10101/<your main route>`.

```sh
$ h2o exec
{"level":"info","log_level":"debug","url":"file:///wave_bundle/q-peak.0.1.2.wave","app_root":"/app","venv_root":"/resources","server_path":"/wave/wave","py_module":"peak","tmp":"/tmp","startup_server":true,"version":"latest-20200929","time":"2020-10-13T06:42:21Z","message":"configuration"}
{"level":"info","port":":10101","time":"2020-10-13T06:42:21Z","message":"starting launcher server"}
{"level":"info","executable":"/wave/wave","time":"2020-10-13T06:42:21Z","message":"wave executable found"}
...
```

### Updating App Visibility

The `h2o app update <appId> -v <visbility>` command can be used to modify an existing app's visibility.

Authors who publish a new version of an app may want to de-list the old version.  It is not possible
to remove an app if there are instances running, as the data may still need to be available.
The preferred method to de-list previous versions is to modify the visibility setting to `PRIVATE`.

### Updating Instance Visibility

The `h2o instance update <instanceId> -v <visbility>` command, much like the `app` version,
can be used to modify an existing running instance's visibility setting.

### Managing App Tags

The `h2o tag [assign, get, list, remove, update]` commands let users see and, when authorized,
manage available app tags.
App tag configuration includes of name/title, RGB color, description, and ACLs
(see [Authorization](basic-concepts#authorization) for details on ACLs and semantics of the related
tag attributes).

## How-To

### Updating App To a Newer Version

The "Catalog" page shows apps with visibility `ALL_USERS`, so rolling out a new app version is done by:

1. [importing a new version](#publishing-an-app-for-others-to-see-and-launch) of the app as `PRIVATE`
1. testing the new version
1. [changing the visibility](#updating-app-visibility) of the new version to `ALL USERS`
1. (optional) [changing the visibility](#updating-app-visibility) of the old version to `PRIVATE`

This is based on the [Basic Concepts](basic-concepts#app):

> Apps are mostly **immutable**, meaning once uploaded, they cannot be changed (except for visibility).
> To "update" an app, one has to upload a new version.

and:

> Internally, H2O AI Cloud treats every app name/version combination as a separate entity.
> The UI then uses the app name to link several versions together; however each can have different
> title, description, owner, instances, etc.

An important corollary is that **instances of the old app version are not affected by the update**
(as they are completely separate from the new app version). The update only prevents users from
starting new instances of the old version.

### Utilizing Secrets

Developers can pass secrets registered with the platform to apps, exposed as environment variables
using the `[[Env]]` section within the `app.toml` or as files using the ``[[File]]`` section.

This allows developers to link their apps with external dependencies (e.g., S3, Driverless AI)
securely, while allowing easy overrides for local development or deployments outside the platform.

:::note
There is currently not a self-service option for developers to add their own secrets,
nor is there an API for listing the available secrets.
Secrets are currently managed by Admins.
Contact your admins for the available secrets or for adding a new one.

We are actively working on improving this.
:::

### App Route

While it is not a strict requirement, since the platform deploys each app with its own Wave server,
we advise that apps use `/` as their main route:

```python
@app('/')
async def serve(q: Q):
    pass
```
