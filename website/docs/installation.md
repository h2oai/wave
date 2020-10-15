---
title: Installation
---

To set up H2O Wave, simply download and extract a release (~8MB). The release ships with a precompiled binary executable, so no explicit installation step is necessary.

## Prerequisites

H2O Wave runs on Linux, macOS, and Windows, having Python 3.6.1 or later.

## Setup

### Step 1: Download

[Download the H2O Wave SDK](https://github.com/h2oai/wave/releases/latest) for your platform. 

### Step 2: Extract

Extract your download.

```shell
tar -xzf wave-x.y.z-linux-amd64.tar.gz
```
### Step 3: Move

Move it to a convenient location, say `$HOME/wave/`.

```shell
 mv wave-x.y.z-linux-amd64 $HOME/wave
```

:::note
If you have a previous version of Wave installed, be sure to remove it before installing another. To remove it, simply delete the previous directory.
:::

Inspect your `$HOME/wave` directory. You should see the following content:

```
.
├── docs/           ... Documentation
├── examples/       ... Examples
├── test/           ... Browser testing framework
├── www/            ... Wave server web root (do not modify!)
└── wave              ... Wave server executable
```

### Step 4: Run

Go to your Wave directory.

```shell
cd $HOME/wave
```

Start the Wave server.

```shell
./wave
```

```
2020/10/15 12:04:40 # 
2020/10/15 12:04:40 # ┌───────────────────┐
2020/10/15 12:04:40 # │   ┬ ┬┌─┐┬  ┬┌─┐   │
2020/10/15 12:04:40 # │   │││├─┤└┐┌┘├┤    │
2020/10/15 12:04:40 # │   └┴┘┴ ┴ └┘ └─┘   │
2020/10/15 12:04:40 # └───────────────────┘
2020/10/15 12:04:40 # 
2020/10/15 12:04:40 # {"address":":55555","t":"listen","webroot":"/home/elp/wave/www"}
```

:::info
On Windows, run `wave.exe` to start the server.
:::

### Step 5: Verify

Finally, point your web browser to [http://localhost:55555/](http://localhost:55555/). You should see an empty page with a spinner that looks like this:

![spinner](assets/installation__waiting.png)

Congratulations! Wave is now running, but doesn't have any content yet (hence the spinner). 

In the next few sections, we'll add some content and see what the fuss is all about.


