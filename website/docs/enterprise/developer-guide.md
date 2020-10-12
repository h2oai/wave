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
    * `Version` - a https://semver.org version of the app
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


### Utilizing Secrets

Developers can pass secrets registered with q8s to apps, exposed as environment variables, using 
the `[[Env]]` section within the q-app.toml.  

There is currently not a self-service option for developers to add their own secrets,
nor is there an API for listing the available secrets.
Secrets are currently managed by Admins.
Contact your admins for the available secrets or for adding a new one.

Note: We are actively working on improving this.   

Note that environment variables prefixed with `Q8S` are disallowed.

## App route

While it is not a strict requirement, due to how apps are deployed in q8s, it is advised that the app
uses `/` as its main route:

```python
if __name__ == '__main__':
    listen('/', main_page)
```

## Runtime Environment 

Q8s configures the runtime environment for all app instances.
Developers can specify the pip-managed dependencies of the app via `requirements.txt` (can contain
references to `.whl` files included in the `.qz` using paths relative to the archive root)

At this moment, q8s does not provide any provisions for developers to customize the OS, 
native OS dependencies, Qd version, etc.

Note: We are actively working on improving this.

## CLI

As a developer, you will need the `q8s-cli` binary to interact with the q8s service.

### Configuring the CLI

First you need to configure the CLI by running `q8s-cli config setup` so that it knows how to talk 
to a particular q8s deployment.  

Be aware, currently the CLI launches a browser to complete the user authentication, and due to this we currently unable to support remote use of the CLI over SSH without provisions for X forwarding. 

### Listing and launching apps

The `q8s-cli app list -a` command will list all apps available for launch. 
To launch an app, the `q8s-cli app run <appId>` command can be used to launch a new instance of that app. 
The `-v` flag can be used with `app run` to specify app instance visibility settings.


### Publishing the app for others to see and launch

Just run `q8s-cli bundle import` in your app git repository. This will automatically package your
current directory into a `.qz` package and import it to q8s.

Others can then use `q8s-cli app run` or the UI to launch the app in q8s.

Note: the name-version combination from your `q-app.toml` has to be unique and q8s will reject
the request if such combination already exists. Thus you need to update the version in `q-app.toml`
before each run.

### Just running the app in q8s

Just run `q8s-cli bundle deploy` in your app git repository. This will automatically package your
current directory into a `.qz` package, import it to q8s, and run it. 

In the output you will be able to find a URL where you can reach the instance, or visit 
the "My Instances" in the UI.

Note: q8s will auto-generate the version so that you can keep executing this without worrying about 
version conflicts, just don't forget to clean up old instances/versions.

### Getting the logs of a running q8s instance

Just run `q8s-cli instance logs`, use the flag `-f` (`--follow`) to tail the log.

### Running the app in q8s-like environment locally

Just run `q8s-cli exec`.

Note that this requires that you have `docker` installed and that you have access to the execution docker image.

Then navigate to `http://localhost:55555/<your main route>`.

### Updating App Visibility

The `q8s-cli app update <appId> -v <visbility>` command can be used to modify an existing app's visibility.    

Authors who publish a new version of an app may want to de-list the old version.  It is not possible to remove an app if
there are instances running, as the data may still need to be available.  The preferred method to de-list previous
versions is to modify the visibility setting to `PRIVATE`.

### Updating Instance Visibility

The `q8s-cli instance update <instanceId> -v <visbility>` command, much like the `app` version, can be used to modify an
existing running instance's visibility setting.

