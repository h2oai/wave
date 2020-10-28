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

### Using Visual Studio Code

1. Launch Visual Studio Code
2. Click "File" -> "Open...", then choose `$HOME/wave-apps`.
3. Click "File" -> "New File"; save the file as, say, `foo.py`.
4. You should now get a prompt asking if you want to install extensions for Python. Click "Install".
5. Write some code (see sample below).
6. Hit `Ctrl+F5` to run, or `F5` to debug.

## Debugging Apps

To debug Wave apps, set your IDE or editor's configuration to execute the command `python -m h2o_wave start --no-reload foo` instead of `python foo.py`.

:::tip
The command `wave run --no-reload foo` is equivalent to `python -m h2o_wave run --no-reload foo`.
:::

### Using PyCharm

- Open the "Run/Debug Configurations" dialog for your script.
- Under "Configuration", change the "Script path" dropdown to "Module name".
- Set "Module name" to `h2o_wave`.
- Set "Parameters" to `start foo` (assuming your app's source code is in `foo.py`)

