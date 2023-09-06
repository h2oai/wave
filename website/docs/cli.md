---
title: Command Line Interface (CLI)
---

The CLI is accessible using the `wave` command, available once you `pip install h2o-wave`.

To view a list of sub-commands, simply run `wave`:

```sh
wave
```

```sh
Usage: wave [OPTIONS] COMMAND [ARGS]...

Options:
  --help  Show this message and exit.

Commands:
  fetch  Download examples and related files to ./wave.
  init   Initial scaffolding for your Wave project.
  learn  Run interactive learning app - Wave university.
  run    Run an app.
  share  Share your locally running app with the world.
```

Get help on a sub-command:

```sh
wave <command> --help
```

## wave run

`wave run` runs an app.

Run app.py with auto reload:

```sh
wave run app
```

Run path/to/app.py with auto reload:

```sh
wave run path.to.app
```

Run path/to/app.py without auto reload:

```sh
wave run --no-reload path.to.app
```

Do not start `waved` automatically:

```sh
wave run app --no-autostart
```

## wave init

Pick a starter app template

## wave fetch

Download examples and `waved`.

```sh
wave fetch
```

```sh
Usage: wave fetch [OPTIONS]

  Download examples and related files to ./wave folder.

  $ wave fetch

Options:
  --platform [linux|windows|darwin] Operating system type.
  --arch [amd64|arm64]              Processor architecture type.
  --help                            Show this message and exit.
```

## wave learn

Run interactive learning app - Wave University. (Requires `h2o-wave-university` package to be installed)

```sh
wave learn
```

## wave share

Expose locally running Wave app to the public internet. Stop sharing by hitting `CTRL+C`.

```sh
wave share
```

```sh
Usage: wave share [OPTIONS]

  Share your locally running app with the world.

  $ wave share

Options:
  --port INTEGER         Port your app is running on (defaults to 10101).
  --subdomain TEXT       Subdomain to use. If not available, a random one is generated.
  --remote-host TEXT     Remote host to use (defaults to h2oai.app).
  --remote-port INTEGER  Remote port to use (defaults to 443).
  --open                 Open the shared app in your browser automatically.
  --help                 Show this message and exit.
```
