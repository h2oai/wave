---
title: Development
---

H2O Wave apps and scripts are plain Python programs. You can develop, debug and test them from the command-line, from the Python REPL, or from your favorite text editor.

Both [PyCharm Community Edition](https://www.jetbrains.com/pycharm/download) and [Visual Studio Code](https://code.visualstudio.com/) are excellent for Python programming.

:::tip
At the time of writing, PyCharm's type-checking and error-detection is superior to Visual Studio Code's Python plugin.
:::

## Getting started

The simplest way to get started in either PyCharm or Visual Studio Code is the same: 
1. Create a working directory.
2. Set up a Python [virtual environment](https://docs.python.org/3/tutorial/venv.html).
3. Install the `h2o-q` package.
4. Open the directory in your IDE.

```shell 
mkdir $HOME/q-apps
cd $HOME/q-apps
python3 -m venv venv
./venv/bin/pip install h2o-q
```

## Using PyCharm 

1. Launch PyCharm
2. Click "File" -> "Open...", then choose `$HOME/q-apps`.
3. Right-click on `q-apps` in the "Project" tree, then click "New" -> "Python File".
4. Enter a file name, say, `hello_world.py`.
5. Write some code (see sample below).
6. Right-click anywhere inside the file and choose "Run hello_world" or "Debug hello_world".

## Using Visual Studio Code

1. Launch Visual Studio Code
2. Click "File" -> "Open...", then choose `$HOME/q-apps`.
3. Click "File" -> "New File"; save the file as, say, `hello_world.py`.
4. You should now get a prompt asking if you want to install extensions for Python. Click "Install".
5. Write some code (see sample below).
6. Hit `Ctrl+F5` to run, or `F5` to debug.

## A hello world sample

```py title="$HOME/q-apps/hello_world.py"
from h2o_q import site, ui

# Grab a reference to the page at route '/hello'
page = site['/hello']

# Add a markdown card to the page.
page['quote'] = ui.markdown_card(
    box='1 1 2 2',
    title='Hello World',
    content='"The Internet? Is that thing still around?" - *Homer Simpson*',
)

# Finally, save the page.
page.save()
```



