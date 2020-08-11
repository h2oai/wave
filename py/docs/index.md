
# Change Log
- [v0.1.4](https://github.com/h2oai/qd/releases/tag/v0.1.3) - Aug 10, 2020
    - Fixed
        - Frame heights are not respected with total height of frames exceeds containing card size
- [v0.1.3](https://github.com/h2oai/qd/releases/tag/v0.1.3) - Aug 10, 2020
    - Fixed
        - `h2o_q.ui.link()` now has a `download` attribute to work around a [Firefox bug](https://bugzilla.mozilla.org/show_bug.cgi?id=858538).
        - Race condition in the interactive tour that caused some examples to not preview properly.
- [v0.1.2](https://github.com/h2oai/qd/releases/tag/v0.1.2) - Aug 7, 2020
    - Added
        - API for `h2o_q.core.Expando` copy, clone and item/attribute deletion.
        - Migration guide.
        - Example for setting browser window title.
        - API and example for Header card: `h2o_q.ui.header_card()`.
        - Export `h2o_q.core.Ref` from `h2o_q`.
        - API and examples for inline frames inside form cards: `h2o_q.ui.frame()`.
    - Changed
        - Renamed env var prefix for settings to `H2O_Q_`.
    - Fixed
        - Plot X/Y axis transpose bug.
- [v0.1.1](https://github.com/h2oai/qd/releases/tag/v0.1.1) - Jul 27, 2020
    - Added
        - Options for file type and size to file upload component.
        - API for displaying desktop notifications.
        - Buttons can now submit specific values instead of only True/False.
        - Examples for layout and card sizing.
        - Image card for displaying base64-encoded images.
        - Example for image card.
        - Vector graphics API.
        - Turtle graphics based path generator.
        - Examples for graphics card.
    - Fixed
        - Re-rendering performance improvements.
- [v0.1.0](https://github.com/h2oai/qd/releases/tag/v0.1.0) - Jul 13, 2020
    - Added
        - Example for displaying iframe content > 2MB.
        - Example for plotting using matplotlib.
        - Example for plotting using Altair.
        - Example for plotting using Vega.
        - Example for plotting using Bokeh.
        - Example for plotting using custom D3.js Javascript.
        - Example for live dashboard with stats cards.
        - Example for master-detail user interfaces using `ui.table()`.
        - Example for authoring multi-step wizard user interfaces.
        - Unload API: `q.unload()` to delete uploaded files.
- [v0.0.7](https://github.com/h2oai/qd/releases/tag/v0.0.7) - Jul 12, 2020
    - Added
        - Download API: `q.download()`.
        - Vega-lite support: `ui.vega_card()`.
        - Context menu support to all cards.
        - `refresh` attribute on `meta_card` allows static pages to stop receiving live updates.
        - Passing `-debug` when starting server displays site stats at `/_d/site`.
        - Drag and drop support for file upload component.
        - Template expression support for markdown cards.
        - All APIs and examples documented.
        - All 110 examples now ship with the Sphinx documentation.
        - Documentation now ships with release download.
    - Changed
        - API consistency: `ui.vis()` renamed to `ui.plot()`.
        - All stats cards now have descriptive names.
        - API consistency: `ui.mark.mark` renamed to `ui.mark.type`.
        - API consistency: `page.sync()` and `page.push()` renamed to `page.save()`.
    - Removed
        - `ui.dashboard_card()` and `ui.notebook_card()`.
- [v0.0.6](https://github.com/h2oai/qd/releases/tag/v0.0.6) - Jul 6, 2020
    - Added
        - Log network traffic when logging is set to debug mode.
        - Capture and display unhandled exceptions on the UI.
        - Routing using location hash.
        - Toolbar component.
        - Tabs component.
        - Nav component.
        - Upload API: `q.upload()`.
    - Changed
        - `q.session` renamed to `q.user`
- [v0.0.5](https://github.com/h2oai/qd/releases/tag/v0.0.5) - Jun 29, 2020
    - Added
        - Add configure() API to configure environment before launching.
- [v0.0.4](https://github.com/h2oai/qd/releases/tag/v0.0.4) - Jun 26, 2020
    - Added
        - Multi-user and multi-client support: launch apps in `multicast` or `unicast` modes in addition to `broadcast` mode.
        - Client-specific data can now be stored and accessed via `q.client`, similar to `q.session` and `q.app`.
        - Simpler page referencing: `import site` can be used instead of `site = Site()`.
    - Changed
        - Apps now lauch in `unicast` mode by default instead of `broadcast` mode.
- [v0.0.3](https://github.com/h2oai/qd/releases/tag/v0.0.3) - Jun 19, 2020
    - Added
        - Make `Expando` data structure available for apps.
- [v0.0.2](https://github.com/h2oai/qd/releases/tag/v0.0.2) - Jun 17, 2020
    - Initial version
- v0.0.1
    - Package stub


# Migration Guide

Before you begin, it is highly recommended that you [download](https://github.com/h2oai/qd/releases) a release and run the interactive `tour.py` that ships with the release to get a feel for what Q programs look like in practice.

## What has changed?

From an app-development perspective, the most important change is that Q is more of a library rather than a framework.

With the previous framework, the only way to execute an app was via the Q server. This limitation has been removed. The script/app you author is just a regular Python program in which you `import h2o_q` and execute via:

1. The command line: `python3 my_script.py`.
2. In the Python REPL.
3. In a Jupyter notebook.
4. In your favorite IDE (PyCharm, VSCode, etc.).

This also means that you can apply breakpoints and debug or step-through your program in your debugger of choice.

From an information architecture perspective, control has been inverted: instead of your app being an extension to Q's data/prep/search features, Q's features are now optional additions to your app, and your app takes center stage. Implementation-wise, instead of your app running in a sidebar inside of Q's UI, your app now occupies the entire UI.

## Breaking changes

**Removed: `@Q.app`, `@Q.ui` annotations.**

Instead, define a `async` request-handling function, say `main()`, and pass that function to `listen()`, like this:

```py
from h2o_q import Q, listen

async def main(q: Q):
  pass

listen('/my/app/route', main)
```

**Removed: `q.wait()`, `q.show()`, `q.fail()`, `q.exit()`.**

The above four methods were the primary mechanism to make changes to your app's UI. They have all been replaced with a single `h2o_q.core.Page.save()` method.

The new technique is:
1. Access the page or card you want to modify.
1. Modify the page or card.
1. Call `h2o_q.core.Page.save()` to save your changes and update the browser page.

Before:
```py
q.wait(
  callback_function,
  ui.text('Step 1'),
  ui.button(name='next', label='Next'),
)
```

After:
```py
q.page['my_card'] = ui.form_card(
  # A card with its top-left corner at column 1, row 5; 2 columns wide and 4 rows high.
  box='1 5 2 4',
  items=[
    ui.text('Step 1'),
    ui.button(name='next', label='Next'),
  ],
)
await q.page.save()
```

Note that the *After* example requires a `box` that specifies where to draw your form. This is because you are not limited to using a sidebar, and can use the entire width/length of the page.

The same technique can be used to update the UI again (or display intermediate results):

Before:
```py
q.wait(
  callback_function,
  ui.text('Step 2'),
  ui.button(name='next', label='Next'),
)
```

After:
```py
# Don't have to recreate the entire form again; simply replace its items and save the page.
q.page['my_card'].items = [
  ui.text('Step 2'),
  ui.button(name='next', label='Next'),
]
await q.page.save()
```

**Removed: callback functions for request-handling.**

Q apps are 100% push-based, using duplex communication instead of a request/reply paradigm. There is no need to have a tangled mess of callbacks to handle UI events.

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

**Removed: `q.dashboard()` and `q.notebook()`.**

Every page in Q is a dashboard page. Instead of creating a separate dashboard or notebook, simply add cards to a page and arrange it the way you want. Cards can be created by using one of the several `ui.*_card()` APIs. Also see the [dashboard](#dashboard), [layout](#layout-position) and [sizing](#layout-size) examples to learn how to lay out several cards on a page.

If you want to display a notebook-style vertical stack of markdown, html or other content, use `h2o_q.ui.text()` and `h2o_q.ui.frame()` contained inside a `h2o_q.ui.form_card()`, like this:

Before:
```
ui.notebook([ui.notebook_section([
  ui.markdown_cell(content='Foo'),
  ui.frame_cell(source=html_foo, height='200px'),
  ui.markdown_cell(content='Bar'),
  ui.frame_cell(source=html_bar, height='200px'),
])])

```

After: Note the parameter name change `frame_cell(source=...)` to `frame(content=...)`.

```
ui.form_cell(
  box='1 5 2 4',
  items=[
    ui.text(content='Foo'),
    ui.frame(content=html_foo, height='200px'),
    ui.text(content='Bar'),
    ui.frame(content=html_bar, height='200px'),
  ],
)
```


**Changed: `ui.buttons()`, `ui.expander()` and `ui.tabs()` accept a `list` of items instead of var args `*args`.**

Before:
```py
ui.buttons(ui.button(...), ui.button(...), ui.button(...))
```

After:
```py
ui.buttons([ui.button(...), ui.button(...), ui.button(...)]) # Note enclosing [ ]
```

**Changed: `q.upload()` changed to `q.site.upload()`.**

The `upload()` method has been moved to the `h2o_q.core.Site` instance, since each `h2o_q.core.Site` represents a distinct server, and makes it possible to control multiple sites from a single Python script.

**Changed: `q.args.foo=` changed to `q.client.foo=`.**

Setting attributes on `q.args` (e.g. `q.args.foo = 'bar'`) is no longer preserved between requests. This was the primary mechanism employed previously to preserve data between requests.

Instead, Q provides 4 mechanisms for preserving data between requests:

1. **Process-level**: Use global variables.
1. **App-level**: Use `q.app.foo = 'bar'` to save; access `q.app.foo` to read it back again.
1. **User-level**: Use `q.user.foo = 'bar'` to save; access `q.user.foo` to read it back again.
1. **Client-level**: Use `q.client.foo = 'bar'` to save; access `q.client.foo` to read it back again.

Here, *Client* refers to a distinct tab in a browser.

If you want to rely on the old behavior of preserving `q.args` for the lifetime of the application, copy `q.args` to `q.client` like this:

```python
from h2o_q import copy_expando

copy_expando(q.args, q.client, exclude_keys=['back2', 'select_target', 'restart'])
```

**Changed: No need to JSON-serialize values to preserve them between requests.**

`q.args.foo=` only supported JSON-serialized values. No such restrictions exist for the `q.app`, `q.user` and `q.client` containers. You could, for example, load a Pandas dataframe and set `q.user.df = my_df`, and the dataframe will be accessible across requests for the lifetime of the app.





.. include:: ../docs/examples.md
