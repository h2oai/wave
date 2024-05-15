---
title: Javascript
---

Wave ships with a growing library of cards and components for assembling user interfaces. For most apps, the built-in components can be adequate. They're designed to work well with each other, with consistent typography, layout and theming; and the library of components keeps expanding with each new release.

However, no matter how comprehensive the Wave library gets over time, there will be situations where an app needs to use external Javascript components to supplement Wave's capabilities, like custom visualizations, UI enhancements, and graphics.

Wave 0.16+ allows importing and using third-party Javascript libraries on a page. This provides an escape-hatch of sorts, allowing you to add UI capabilities that are not yet possible with stock Wave.

## Basic Usage

The simplest way to run custom Javascript code on a page is to use an inline script (`ui.inline_script()`):

```py
q.page['meta'] = ui.meta_card(box='', script=ui.inline_script('alert("Hello World!");'))
q.page.save()
```

To execute additional bits of Javascript code, set the `meta_card`'s `script` property again:

```py
q.page['meta'].script = ui.inline_script('console.log("One Mississippi");')
q.page.save()

q.page['meta'].script = ui.inline_script('console.log("Two Mississippi");')
q.page.save()

q.page['meta'].script = ui.inline_script('console.log("Three Mississippi");')
q.page.save()
```

Passing `scripts` to `ui.meta_card()` dynamically imports external Javascript libraries.

### Import a library

```py
q.page['meta'] = ui.meta_card(box='', scripts=[ui.script('https://cdnjs.cloudflare.com/ajax/libs/animejs/2.0.2/anime.min.js')])
```

### Import multiple libraries

```py
q.page['meta'] = ui.meta_card(box='', scripts=[
    ui.script('https://cdnjs.cloudflare.com/ajax/libs/animejs/2.0.2/anime.min.js'),
    ui.script('https://cdnjs.cloudflare.com/ajax/libs/d3/6.7.0/d3.min.js'),
    ui.script('https://cdnjs.cloudflare.com/ajax/libs/bokeh/2.3.2/bokeh.min.js'),
])
```

### Import and use a library

```py
q.page['meta'] = ui.meta_card(
    box='',
    # Load anime.js
    scripts=[ui.script('https://cdnjs.cloudflare.com/ajax/libs/animejs/2.0.2/anime.min.js')],
    script=ui.inline_script(
        # The Javascript code for this script.
        content='anime.timeline(...);',
        # Execute this script only if the 'anime' library is available.
        requires=['anime'],
        # Execute this script only if the 'animation' element is available.
        targets=['animation'],
    )
)
q.page['example'] = ui.markup_card(
    box='1 1 10 8',
    title='Animation',
    content='<div id="animation"/>',
)
```

In the above example, we create an empty `div` HTML element on the page, load an animation library (anime.js), add a bit of Javascript to animate the `div` element. To tie things together correctly, we pass two additional arguments to `ui.inline_script()`:

- The `requires` argument ensures that the library we intend to use (in this case, `anime.js`) is downloaded, imported, and ready to use.
- The `targets` argument ensures that the HTML element the scripts operates on (in this case, the `div` element named `animation`), is available on the page. [CSS selectors](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors) can also be used to identify target elements.

### Import ESM module

When using JavaScript module files (`.mjs`), the script `type="module"` attribute needs to be specified.

```py
q.page['meta'] = ui.meta_card(box='', scripts=[ui.script(type="module", path='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.2.67/pdf.min.mjs')])
```

For other script types see the [official documentation](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script/type).

## Handling Events

In most cases, when employing custom Javascript libraries, you'll want to handle and transmit events from the library to your app. To do this, use the Javascript function `wave.emit()`:

```js
// Javascript
wave.emit('event_source', 'event_name', event_data); 
```

You can then access this information in your app using:

```py
# Python
event_data = q.events.event_source.event_name
```

For example, emitting an event using `wave.emit('graph', 'node_clicked', 42)` in Javascript will set `q.events.graph.node_clicked` to `42` in Python.

All three arguments to `wave.emit()` are arbitrary. In the above example, we use:

- `graph` to indicate the source of the event.
- `node_clicked` to indicate the type of event.
- the third argument can be a string, number, boolean or any complex structure, like `{ foo: 'bar', qux: 42 }`.

Here's a complete, minimal example that prints mouse coordinates each time you click on a page.

```py
from h2o_wave import main, app, Q, ui

@app('/demo')
async def serve(q: Q):
    if not q.client.initialized:
        q.page['meta'] = ui.meta_card(box='', script=ui.inline_script(
            # Handle and transmit event
            'window.onclick = (e) => wave.emit("window", "clicked", { x: e.clientX, y: e.clientY });'
        ))
        q.client.initialized = True
    else:
        # Capture event
        if q.events.window:
            click = q.events.window.clicked
            if click:
                print(click.x, click.y)

    await q.page.save()
```

## Examples

You can play with more examples in the [Wave Tour](/docs/installation#run-the-tour) as well.
