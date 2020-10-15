---
title: Basic Concepts
slug: /enterprise/basic-concepts
---


H2O AI Cloud, a.k.a. q8s, recognizes three actors:

* **App Developer**: creates and publishes apps
* **App User**: browses and runs apps
* **Admin**: manages the platform

over two resource types:

* **App**: runnable Wave app package
* **App instance**: running instane of an app

## App

App is a runnable Wave app package with metadata, such as (grouped into categories):

* Identity
  * a unique name and version identifier
* Display/search
  * a title and description
  * icon and screenshots
  * search category and keywords
* Authorization
  * owner (e.g., the person who imported it into H2O AI Cloud)
  * visibility (`PRIVATE`, `ALL_USERS`)
* Runtime
  * RAM/disk requirements
  * other runtime settings (e.g., pointers to dependencies and secrets to be injected at startup time)

Users can start/run multiple instances of each app (subject to authorization, see below).

Apps are mostly **immutable**, meaning once uploaded, they cannot be changed (except for visibility).
To "update" an app, one has to upload a new version.

:::note
Internally, H2O AI Cloud treats every app name/version combination as a separate entity.
The UI then uses the app name to link several versions together; however each can have different
title, description, owner, instances, etc.
:::

## App Instance

App instance is a running instance of an app wit the following metadata:

* pointer to the corresponding app
* owner (the person who started it)
* visibility (`PRIVATE`, `ALL_USERS`, `PUBLIC`)

H2O AI Cloud fully manages the app instance lifecycle on behalf of its users.

Instances can be stateless or stateful (depending on the app configuration)
and can use external dependencies (e.g., AWS S3, Driverless AI).

Under the hood, each instance consists of several k8s resources, specifically, each instance is running in its
own k8s `pod`, under its own k8s `service`, accessible via a H2O AI Cloud subdomain (e.g., `https://1234.q8s.h2o.ai`).
It can optionally include other resources, such as PVCs, Configmaps, etc.

## Authorization

### App Access Authorization

Access to apps is governed by the following rules:

* `PRIVATE` apps are only visible to/runnable by the owner;
    these are typically created via `q8s-cli bundle deploy`
* `ALL_USERS` apps are visible to/runnable by all signed-in users; they are also visible on the "Catalog" page;
    these are typically created via `q8s-cli bundle import`
* App owner can manage (view, update, delete) her apps via `q8s-cli app ...` or via the "My Apps" page.

### Instance Access Authorization

Access to app instances is governed by the following rules:

* `PRIVATE` instances are only visible to the owner and the owner of the corresponding app (the app owner has only read access)
* `ALL_USERS` instances are visible to all signed-in users
* `PUBLIC` instances are visible to anyone on the Internet
* Instance owner can manage (view, update, terminate) her instances via `q8s-cli instance` or via the "My instances" page.

Note that app/instance visibility can be modified by the owner, e.g., using `q8s-cli (app|instance) update <id> -v <visibility>`
 or via the "My Apps"/"My Instances" page.

Admin access is exempt from all the authorization rules (i.e., admins have full access to all apps/instances).
