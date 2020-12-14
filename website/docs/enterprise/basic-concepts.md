---
title: Basic Concepts
slug: /enterprise/basic-concepts
---

H2O AI Cloud platform recognizes three actors:

* **App Developer**: creates and publishes apps
* **App User**: browses and runs apps, can be either user with "full access" or visitor
* **Admin**: manages the platform

over three resource types:

* **App**: runnable Wave app package
* **App instance**: running instance of an app
* **App tag**: label for categorizing apps withing the platform

## App

App is a runnable Wave app package with metadata, such as (grouped into categories):

* Identity
  * a unique name and version identifier
* Display/search
  * a title and description
  * icon and screenshots
  * search category and keywords
* Authorization
  * owner (i.e., the person who imported it into H2O AI Cloud)
  * visibility (`PRIVATE`, `ALL_USERS`)
* Runtime
  * RAM/disk requirements
  * other runtime settings (e.g., pointers to dependencies and secrets to be injected at startup time)

Users can start/run multiple instances of each app (subject to authorization, see below).

Apps are mostly **immutable**, meaning once uploaded, they cannot be changed (except for visibility).
To "update" an app, one has to upload a new version. This is to simplify the app lifecycle
and remove the need for developers to address app upgrade/downgrade.

:::note
Internally, H2O AI Cloud treats every app name/version combination as a separate entity.
The UI then uses the app name to link several versions together; however each can have different
title, description, owner, instances, etc.
:::

## App Instance

App instance is a running instance of an app with the following metadata:

* pointer to the corresponding app
* owner (the person who started it)
* visibility (`PRIVATE`, `ALL_USERS`, `PUBLIC`)

H2O AI Cloud fully manages the app instance lifecycle on behalf of its users.

Instances can be stateless or stateful (depending on the app configuration)
and can use external dependencies (e.g., AWS S3, Driverless AI).

Under the hood, each instance consists of several k8s resources, specifically, each instance is running in its
own k8s `pod`, under its own k8s `service`, accessible via a H2O AI Cloud subdomain (e.g., `https://1234.wave.h2o.ai`).
It can optionally include other resources, such as PVCs, Configmaps, etc.

## App Tag

Tags are means of annotating apps in the platform (similar to
[GitHub issue labels](https://docs.github.com/en/free-pro-team@latest/github/managing-your-work-on-github/about-labels)).
Beyond visually categorizing apps, tags also act as a mechanism by which apps are exposed to "visitors" (i.e., users without "full access");
see [Authorization for Visitors](#authorization-for-visitors) for details.

Tags are standalone resources with the following metadata (grouped into categories):

* Display/search properties
  * name, title, color, description
* ACLs
  * admin roles (i.e., the users that can manage the tag)
  * visitor roles  (i.e., the visitors that can view apps with this tag)
  
Tags are assigned to apps individually, each tag can be assigned to multiple apps, each app can
have multiple tags assigned.

## Authorization

Authorization rules differ depending on the role of a user, distinguishing between users with "full access",
visitors (users without "full access"), and admins.

### App Authorization for Users with Full Access

Access to apps is governed by the following rules:

* `PRIVATE` apps are only visible to/runnable by the owner;
    these are typically experimental versions created via `h2o bundle deploy`
* `ALL_USERS` apps are visible to/runnable by all signed-in users with "full access"; they are also visible on the "Catalog" page;
    these are typically created via `h2o bundle import`
* The app owner can manage (view, update, delete) her apps via `h2o app ...` or via the "My Apps" page
* Any user with "full access" can import new apps into the platform via `h2o ...`

See [Developer Guide](developer-guide#cli) for details on managing apps.

### Instance Authorization for Users with Full Access

Access to app instances is governed by the following rules:

* `PRIVATE` instances are only visible to the owner (and to an extent to the owner of the corresponding app, see below for details)
* `ALL_USERS` instances are visible to all signed-in users with "full access"
* `PUBLIC` instances are visible to anyone on the Internet
* The instance owner can manage (view, update, terminate, see status/logs of) her instances via `h2o instance` or via the "My instances" page
* App owner can see metadata, status, and logs of her app's instances via `h2o instance` or via the app detail page
  regardless of instance visibility; this is to facilitate troubleshooting;
  note that this does not include access to the app UI itself or any write access

Note that app/instance visibility can be modified by the owner, e.g., using `h2o (app|instance) update <id> -v <visibility>`
or via the "My Apps"/"My Instances" page.

See [Developer Guide](developer-guide#cli) for details on managing app instances.

### Tag Authorization for Users with Full Access

Access to tags is governed by the following rules:

* All users with "full access" can see all tags and tag assignments
* A tag can only be assigned/removed/updated by users having a role (as determined by the auth provider)
  that is present in the tag's `Admin Roles` list; empty means any user with "full access" is allowed
* Currently, tags can only be created by admins

See [Developer Guide](developer-guide#managing-app-tags) for details on managing tags.

### Authorization for Visitors

Visitors, a.k.a., users without "full access", have limited permissions within the platform:

* Visitors can only ever see their own instances, regardless of instance visibility (technically,
  they can also access UI of the `PUBLIC` instances, if given the URL)
* Visitors cannot see app logs, not even for their own instances  
* Visitors cannot import apps into the platform
* Visitors can only see/run `ALL_USERS` apps that have a tag which includes one of the visitor's roles
  (as determined by the auth provider) in the tag's `Visitor Roles`; empty means no visitors are allowed
  * *Example*: Visitor `UA` has role `RA`, visitor `UB` has role `RB`, tag `TA` has `Visitor Roles` `RA, RC`, tag
    `TB` has `Visitor Roles` `RB`, app `A1` has no tags, app `A2` has tag `TA`, app `A3` has tags `TA, TB` but is `PRIVATE`.
    In this case, user `UA` can see and run app `A2`, while `UB` cannot see or run any apps.
* Visitors cannot see tags or tag assignments

### Authorization for Admins

The admin API gives admins read/write access to all apps/instances/tags.
Note that the admin API does not allow access to the app UI itself, meaning admins cannot access UI of `PRIVATE` instances.
Similarly, admins cannot impersonate another user, e.g., for the purposes of importing/running an app.
