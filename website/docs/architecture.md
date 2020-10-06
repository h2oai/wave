---
title: Architecture
---

H2O Q is a software stack for building beautiful, low-latency, realtime, browser-based applications and dashboards entirely in Python without using HTML, Javascript or CSS.

It excels at capturing data, visualizations, and graphics from multiple sources, and broadcasting them live over the web.

The stack is engineered from the ground-up for low-latency, realtime information display, and is usable on its own (not only a programming framework, but a programmable content server).

## Overview

The H2O Q runtime operates over three tiers:
- **A content server.** The Q server, a ~10MB static binary executable that runs anywhere[^1].
- **A language driver.** The [h2o-q PyPI package](https://pypi.org/project/h2o-q/) used by Q scripts and apps.
- **A browser-based client.** The user interface and components.

```
+---------+                        +---------+
| Browser +---------+      +-------> app1.py |
+---------+         |      |       +---------+
                    v      |
+---------+       +-+------+-+     +---------+
| Browser +------>+ Q Server +-----> app2.py |
+---------+       +-+------+-+     +---------+
                    ^      |
+---------+         |      |       +---------+
| Browser +---------+      +------>+ app3.py |
+---------+                        +---------+
```

The Q server has three main functions:
- Store site content
- Transmit content changes to browsers.
- Transmit browser events to apps.

In other words, the Q server is comparable to a in-memory realtime database, a HTTP web server and a proxy server, all rolled into one, with browsers (*clients*) downstream, and Q apps (or scripts) upstream.

The language driver (the [h2o-q PyPI package](https://pypi.org/project/h2o-q/)) provides the ability to manage content on the Q server. It's similar in function to a database driver, but unlike typical database drivers (which use SQL as a protocol), the Q driver provides an API closely integrated with the Python language that feels natural and idiomatic in practice.

The browser-based client's job is to render content on the user interface, and transmit user actions in the form of *events* back to the Q server.

## How does it work?

The Q server stores all content in a page cache called a *site*. A site is a collection of [pages](pages.md). Each page has an address, called its *route*. A page is composed of [cards](cards.md). A card holds content, and any tabular data associated with the content, called [data buffers](buffers.mdx).

When a browser is pointed to a route, it pulls a copy of the page, creates a *replica* locally, and renders the content on the user interface.

The language driver (the `h2o-q` PyPI package) maintains an illusion that server-side content is available locally. Local updates to pages and cards are transmitted in the form of *operations* to the server. The server applies those updates to the master copy of the content. If any browser is currently displaying that content, the server forwards updates to the browser, causing the browser to update its replica and re-render its user interface.

```
   Python
+------------+
|  app.py    |
|     +      |
|     |      |
|     v      |
| +---+----+ |
+-+ Driver +-+
  +---+----+
      |
      |Operations
      |
      v
+-----+------+
|  Q Server  |
|            |
|  +------+  |
|  | Page |  |
|  +------+  |
|            |
+-----+------+
      |
      |Replication
      |
+-------------+
| +---------+ |
| | Replica | |
| +---------+ |
|             |
|     UI      |
+-------------+
    Browser
```


The language driver can be used by two kinds of Python programs: *Q apps* and *Q scripts*.
- [Q apps](apps.md) are interactive programs that can update content and respond to user actions.
- [Q scripts](scripts.md) are simpler, non-interactive (batch) programs: they can update content, but not respond to user actions.

Q apps sport a websocket server under the hood. When a Q app is launched, it announces its existence to the Q server, and the Q server establishes a *relay* with the Q app. When a browser tries to connect to an app, the Q server acts as a hub, relaying information back and forth between the browser and the app.

## How is it different?

The Q server retains content. This is an important concept to understand, and the primary reason why Q is different from a typical web framework. A Q script can update content and exit, and the Q server will happily continue serving that content. In other words, no Python process needs to be around if a new user arrives after you script has exited.

Different parts of the same page can be updated by different scripts running on different devices. Also, all content is live (or reactive) all the time: browsers always display up-to-date content without the need to reload.

---

[^1] Linux, Windows, Darwin, BSD, Solaris, Android on amd64, arm, 386, ppc, mips; [almost everywhere](https://gist.github.com/asukakenji/f15ba7e588ac42795f421b48b8aede63).
