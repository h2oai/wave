<div><img width="175" src="assets/telesync.png"/></div><br/>

**Telesync: Q's Realtime App SDK**

- [Getting Started](#getting-started)
- [Examples](https://github.com/h2oai/telesync/tree/master/py/examples)
- [Report an issue](https://github.com/h2oai/q/issues)

## Getting Started

To build apps using Telesync, you need the `telesync` development server and the `telesync` pip package.

1. [Download](https://github.com/h2oai/telesync/releases) a release. The release contains everything you need, including the SDK, documentation and examples.
2. See `readme.txt` included with your release.

## Migration Guide

### Breaking changes

**1. `q.wait()`, `q.show()`, `q.fail()`, `q.exit()` removed.**

**2 `q.dashboard()` and `q.notebook()` removed.**

**3. `ui.buttons()`, `ui.expander()` and `ui.tabs()` accept a `list` of items instead of var args `*args`**

Before:
```py
ui.buttons(ui.button(...), ui.button(...), ui.button(...))
```

After:
```py
ui.buttons([ui.button(...), ui.button(...), ui.button(...)]) # Note enclosing [ ]
```

**4. `q.upload()` changed to `q.site.upload()`**

**5. `q.args.foo=` changed to `q.client.foo=`**