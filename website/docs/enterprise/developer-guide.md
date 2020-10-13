---
title: Developer Guide
slug: /enterprise/developer-guide
---


## App Bundle Structure

Each q8s-compatible app has to be bundled as a zip archive (commonly used with suffix `.qz`)
consisting of:

* `q-app.toml` - to q8s configuration file
* `static/` - static asset directory, including the app icon (a png file starting with `icon`)
  and screenshots (files starting with `screenshot`)
* `requirements.txt` - pip-managed dependencies of the app (can contain references to `.whl` files
  included in the `.qz` using paths relative to the archive root)
* app source code

You can quickly create a `.qz` archive by running `q8s-cli bundle` in your app git repository
(see the [CLI](#cli) section)

### q-app.toml

Each q8s-compatible app has to contain a `q-app.toml` configuration file in the [TOML](https://toml.io/en/) format,
placed in the root of the `.qz` archive, example:

```toml
[App]
Name = "ai.h2o.q.my-app"
Version = "0.0.1"
Title = "My awesome app"
Description = "This is my awesome app"
Category = "Other"
Keywords = ["awesome"]

[Runtime]
Module = "q_app.run"
VolumeMount = "/data"
VolumeSize = "1Gi"
MemoryLimit = "500Mi"
MemoryReservation = "400Mi"

[[Env]]
Name = "ENVIRONMENT_VARIABLE_NAME"
Secret = "SecretName"
SecretKey = "SecretKeyName"

[[Env]]
Name = "ANOTHER_ENVIRONMENT_VARIABLE_NAME"
Secret = "SecretName"
SecretKey = "AnotherSecretKeyName"
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
  * `Description` - a multiline description of the app for presentation in UI/CLI; string
  * `Category` - category for organizing apps into groups, string
      (UI recognizes `All`, `Data Science`, `Financial Services`, `Healthcare`, `Insurance`,
      `Manufacturing`, `Marketing`, `Retail`, `Sales`, `Telecommunications`, and `Other`)
  * `Keywords` - keywords for search in the UI/CLI, list of strings
* `Runtime`
  * `VolumeMount` and `VolumeSize` - request for a volume to persist app instance data across
       restarts, `VolumeMount` has to be an absolute path, `VolumeSize` needs to conform to the
       [k8s resource model](https://github.com/fabric8io/kansible/blob/master/vendor/k8s.io/kubernetes/docs/design/resources.md#resource-quantities).
  * `MemoryLimit` and `MemoryReservation` - memory requirements for an instance of the app
      (default to service-wide settings managed by Admins); be conservative with these limits;
      `MemoryLimit` is a hard limit on the maximum amount of memory an instance can use before it is OOM-killed;
      `MemoryReservation` is how much memory is required to schedule an instance of the app.
* `Env` - request for a configuration/secret to be injected into an instance at startup-time as an Env variable;
  repeated; see [Utilizing Secrets](#utilizing-secrets).
  * `Name` - name of the Env variable to the injected into the Python process
  * `Secret` - name of the shared secret to use; each secret can contain multiple key-value pairs
  * `SecretKey` - name of the key within the secret to use

## Runtime Environment

Q8s configures the app instance runtime environment, i.e., OS, OS dependencies, location of the app code/venv, etc.

Developers can specify the pip-managed dependencies of the app via `requirements.txt` (can contain
references to `.whl` files included in the `.qz` using paths relative to the archive root)

Developers can further customize the runtime environment by [Utilizing Secrets](#utilizing-secrets).

:::note
At this moment, q8s does not provide any provisions for developers to customize the OS,
native OS dependencies, Qd version, etc.

We are actively working on improving this.
:::

## CLI

As a developer, you will need the `q8s-cli` binary to interact with the q8s service.

### Configuring the CLI

First you need to configure the CLI by running `q8s-cli config setup` so that it knows how to talk
to a particular q8s deployment.

Be aware, currently the CLI launches a browser to complete the user authentication, and due to this
we currently unable to support remote use of the CLI over SSH without provisions for X forwarding.

### Listing existing apps

The `q8s-cli app list -a` command will list all apps available for launch.

```sh
$ q8s-cli app list -a
ID                                   TITLE                          OWNER            CREATED UPDATED CATEGORY      VISIBILITY
abc543210-0000-0000-0000-1234567890ab Q Peak 0.1.1                   user1@h2o.ai     18d     18d     Healthcare    ALL_USERS
bcd543210-1111-1111-1111-0123456789ab Q Tour 0.0.15-20200922162859   user2@h2o.ai     20d     20d     Other         ALL_USERS
...
```

### Launching existing apps

To launch an app, the `q8s-cli app run <appId>` command can be used to launch a new instance of that app.
The `-v` flag can be used with `app run` to specify app instance visibility settings.

```sh
$ q8s-cli app run bcd543210-1111-1111-1111-0123456789ab
ID  22222222-3333-4444-5555-666666666666
URL https://22222222-3333-4444-5555-666666666666.q8s.h2o.ai
```

### Publishing an app for others to see and launch

Just run `q8s-cli bundle import` in your app git repository. This will automatically package your
current directory into a `.qz` package and import it to q8s.

If you set the visibility to `ALL_USERS` (via the `-v` flag), others will be able use `q8s-cli app run`
or the UI to launch the app in q8s.

Note: the name-version combination from your `q-app.toml` has to be unique and q8s will reject
the request if such combination already exists. Therefore, you need to update the version in `q-app.toml`
before each run.

```sh
$ q8s-cli bundle import -v ALL_USERS
ID              bcd543210-1111-1111-1111-0123456789ab
Title           Q Peak
Version         0.1.2
Category        Healthcare
Created At      2020-10-13 06:28:03.050226 +0000 UTC
Updated At      2020-10-13 06:28:03.050226 +0000 UTC
Owner           user1@h2o.ai
Visibility      ALL_USERS
Bundle Location ai.h2o.q.peak.0.1.2.qz
Icon Location   ai.h2o.q.peak.0.1.2/icon.jpg
Description     Forecast of COVID-19 spread
```

### Running an app under development in q8s

Just run `q8s-cli bundle deploy` in your app git repository. This will automatically package your
current directory into a `.qz` package, import it to q8s, and run it.

In the output you will be able to find a URL where you can reach the instance, or visit
the "My Instances" in the UI.

Note: q8s will auto-generate the version so that you can keep executing this without worrying about
version conflicts, just don't forget to clean up old instances/versions.

```sh
$ q8s-cli bundle deploy
ID              bcd543210-1111-1111-1111-0123456789ab
Title           Q Peak
Version         0.1.2-20201013062803
Category        Healthcare
Created At      2020-10-13 06:28:03.050226 +0000 UTC
Updated At      2020-10-13 06:28:03.050226 +0000 UTC
Owner           user1@h2o.ai
Visibility      PRIVATE
Bundle Location ai.h2o.q.peak.0.1.2-20201013062803.qz
Icon Location   ai.h2o.q.peak.0.1.2-20201013062803/icon.jpg
Description     Forecast of COVID-19 spread
ID  22222222-3333-4444-5555-666666666666
URL https://22222222-3333-4444-5555-666666666666.q8s.h2o.ai
```

### Getting the logs of a running q8s instance

Just run `q8s-cli instance logs`, use the flag `-f` (`--follow`) to tail the log.

```sh
$ q8s-cli instance logs c22222222-3333-4444-5555-666666666666
...
2020/10/13 06:38:58 #   ____ _____/ /
2020/10/13 06:38:58 #  / __ `/ __  /
2020/10/13 06:38:58 # / /_/ / /_/ /
2020/10/13 06:38:58 # \__, /\__,_/
2020/10/13 06:38:58 #   /_/
2020/10/13 06:38:58 #
2020/10/13 06:38:58 # {"address":":55555","t":"listen","webroot":"/qd/www"}
2020/10/13 06:38:58 # {"host":"ws://127.0.0.1:55556","route":"/","t":"relay"}
...
```

### Running the app in q8s-like environment locally

Just run `q8s-cli exec`. This will bundle the app in a temporary `.qz` and launch it locally
using our q8s docker image.

Note that this requires that you have docker installed and that you have access to the docker image.

Then navigate to `http://localhost:55555/<your main route>`.

```sh
$ q8s-cli exec
{"level":"info","log_level":"debug","url":"file:///qz/q-peak.0.1.2.qz","app_root":"/app","venv_root":"/resources","server_path":"/qd/qd","py_module":"peak","tmp":"/tmp","startup_server":true,"version":"latest-20200929","time":"2020-10-13T06:42:21Z","message":"configuration"}
{"level":"info","port":":55555","time":"2020-10-13T06:42:21Z","message":"starting launcher server"}
{"level":"info","executable":"/qd/qd","time":"2020-10-13T06:42:21Z","message":"q executable found"}
...
```

### Updating App Visibility

The `q8s-cli app update <appId> -v <visbility>` command can be used to modify an existing app's visibility.

Authors who publish a new version of an app may want to de-list the old version.  It is not possible
to remove an app if there are instances running, as the data may still need to be available.
The preferred method to de-list previous versions is to modify the visibility setting to `PRIVATE`.

### Updating Instance Visibility

The `q8s-cli instance update <instanceId> -v <visbility>` command, much like the `app` version,
can be used to modify an existing running instance's visibility setting.

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

Developers can pass secrets registered with q8s to apps, exposed as environment variables, using
the `[[Env]]` section within the `q-app.toml`.

This allows developers to link their apps with external dependencies (e.g., S3, Driverless AI)
securely, while allowing easy overrides for local development.

Environment variables prefixed with `Q8S` are disallowed.

:::note
There is currently not a self-service option for developers to add their own secrets,
nor is there an API for listing the available secrets.
Secrets are currently managed by Admins.
Contact your admins for the available secrets or for adding a new one.

We are actively working on improving this.
:::

### App Route

While it is not a strict requirement, since each app in q8s is deployed with its own Qd,
it is advised that apps use `/` as its main route:

```python
if __name__ == '__main__':
    listen('/', main_page)
```
