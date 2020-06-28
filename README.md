<div><img width="175" src="assets/telesync.png"/></div><br/>

**Telesync: Q's Realtime App SDK**

- [Getting Started](#getting-started)
- [Examples](https://github.com/h2oai/telesync/tree/master/py/examples)
- [Report an issue](https://github.com/h2oai/q/issues)

## Getting Started

#### Step 1: Get Telesync

[Download](https://github.com/h2oai/telesync/releases) the development server and run:

```
$ ./telesync
```

#### Step 2: Install the Python driver

```
pip install -U telesync
```

#### Step 3: Hello World!

```python
# ----- hello.py -----

from telesync import site, ui

# Access the web page at http://localhost:55555/demo
page = site['/demo']

# Add some content.
page['example'] = ui.markdown_card(
  box='1 1 2 2',
  title='Hello World!',
  content='And now for something completely different.',
)

# Save the page
page.sync()
```

#### Step 4:

Run your code:

```
$ python3 hello.py
```

#### Step 5:

Go to http://localhost:55555/demo

## Migration Guide

### Breaking changes

**1. `ui.buttons()`, `ui.expander()` and `ui.tabs()` accept a `list` of items instead of var args `*args`**

Before:
```py
ui.buttons(ui.button(...), ui.button(...), ui.button(...))
```

After:
```py
ui.buttons([ui.button(...), ui.button(...), ui.button(...)]) # Note enclosing [ ]
```
