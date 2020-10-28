---
title: Command Line Interface
---

The CLI is accessible using the `wave` command, available once you `pip install h2o-wave`.

To view a list of sub-commands, simply run `wave`:

```shell
$ wave
```
```
Usage: wave [OPTIONS] COMMAND [ARGS]...

Options:
  --help  Show this message and exit.

Commands:
  run  Run an app.
```

Get help on a sub-command:

```shell
$ wave <command> --help
```

## wave run

Run an app.

Run app.py with auto reload:
```shell
$ wave run app
```

Run path/to/app.py with auto reload:
```shell
$ wave run path.to.app
```

Run path/to/app.py without auto reload:
```shell
$ wave run --no-reload path.to.app
```
