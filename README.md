<div><img width="175" src="assets/telesync.png"/></div><br/>

**Telesync: Q's Realtime App SDK**

- [Getting Started](#getting-started)
- [Migration Guide](#migration-guide)
- [Examples](https://github.com/h2oai/telesync/tree/master/py/examples)
- [Report an issue](https://github.com/h2oai/q/issues)

## Getting Started

To build apps using Telesync, you need the `telesync` development server and the `telesync` pip package.

1. [Download](https://github.com/h2oai/telesync/releases) a release. The release contains everything you need, including the SDK, documentation and examples.
2. See `readme.txt` included with your release.

## Migration Guide

### Breaking changes

#### No magic `@Q.app`, `@Q.ui` annotations

Instead, define a `async` request-handling function, say `main()`, and pass that function to `listen()`, like this:

```py
from telesync import Q, listen

async def main(q: Q):
  pass

listen('/my/app/route', main)
```

#### `q.wait()`, `q.show()`, `q.fail()`, `q.exit()` removed.

The above four methods were the primary mechanism to make changes to your app's UI. They have all been replaced with a single `.save()` method.

The new technique is:
1. Access the page or card you want to modify.
1. Modify the page or card.
1. Call `page.save()` to save your changes and update the browser page.

Before:

```py
q.wait(
  callback_function,
  ui.text('Step 1'),
  ui.button(name='next', 'Next'),
)
```

After:
```py
q.page['my_card'] = ui.form_card(
  box='1 5 2 4', # A card with its top left corner at column 1, row 5; 2 columns wide and 4 rows high.
  items=[
    ui.text('Step 1'),
    ui.button(name='next', 'Next'),
  ],
)
await q.page.save()
```

Note that the the *After* example requires a `box` that specifies where to draw your form. This is because you are not limited to using a sidebar, and can use the entire width/length of the page.

The same technique can be used to update the UI again (or display intermediate results):

```py
q.wait(
  callback_function,
  ui.text('Step 2'),
  ui.button(name='next', 'Next'),
)
```

After:
```py
# Don't have to recreate the entire form again; simply replace its items and save the page.
q.page['my_card'].items = [
  ui.text('Step 2'),
  ui.button(name='next', 'Next'),
]
await q.page.save()
```

#### No callback functions

Telesync apps are 100% push-based, using duplex communication instead of a request/reply paradigm. There is no need to have a tangled mess of callbacks to define application logic.

Instead, all requests are routed to a single function, and you can decide how to organize your application logic by branching on `q.args.*`.

Before:

```py
def step1(q: Q):
  q.wait(
    step2,
    ui.text('Step 1'),
    ui.button(name='next', label='Next'),
  )

def step2(q: Q):
  q.wait(
    step3,
    ui.text('Step 2'),
    ui.button(name='next', label='Next'),
  )

def step3(q: Q):
  q.wait(
    step4,
    ui.text('Step 3'),
    ui.button(name='next', label='Next'),
  )
```

After:

```py
async def main(q: Q):
  if q.args.step2:
    items = [
      ui.text('Step 2'),
      ui.button(name='step3', label='Next'),
    ]
  elif q.args.step3:
    items = [
      ui.text('Step 3'),
      ui.button(name='step4', label='Next'),
    ]
  else:
    items = [
      ui.text('Step 1'),
      ui.button(name='step2', label='Next'),
    ]

  q.page['my_card'].items = items
  await q.page.save()

listen('/my/app/route', main)
```

#### `q.dashboard()` and `q.notebook()` removed.

Every page in Telesync is a dashboard page. Instead of creating a separate dashboard or notebook, simply add cards to a page and arrange it the way you want. Cards can be created by using one of the several `ui.*_card()` APIs. Also see the "Dashboard" and "Layout" example to learn how to lay out serveral cards on a page.

#### `ui.buttons()`, `ui.expander()` and `ui.tabs()` accept a `list` of items instead of var args `*args`

Before:
```py
ui.buttons(ui.button(...), ui.button(...), ui.button(...))
```

After:
```py
ui.buttons([ui.button(...), ui.button(...), ui.button(...)]) # Note enclosing [ ]
```

#### `q.upload()` changed to `q.site.upload()`

The `upload()` method has been moved to the `Site` instance, since each `Site` represents a distinct server, and makes it possible to control multiple sites from a single Python script.

#### `q.args.foo=` changed to `q.client.foo=`

Setting attributes on `q.args` (e.g. `q.args.foo = 'bar'`) is no longer preserved between requests. This was the primary mechanism employed previously to preserve data between requests.

Instead, Telesync provides 4 mechanisms for preserving data between requests:

1. **Process-level**: Use global variables.
1. **App-level**: Use `q.app.foo = 'bar'` to save; access `q.app.foo` to read it back again.
1. **User-level**: Use `q.user.foo = 'bar'` to save; access `q.user.foo` to read it back again.
1. **Client-level**: Use `q.client.foo = 'bar'` to save; access `q.client.foo` to read it back again.

Here, *Client* refers to a distinct tab in a browser.

#### No need to JSON-serialize values to preserve them between requests.

`q.args.foo=` only supported JSON-serialized values. No such restrictions exist for the `q.app`, `q.user` and `q.client` containers. You could, for example, load a Pandas dataframe and set `q.user.df = my_df`, and the dataframe will be accessible across requests for the lifetime of the app.



