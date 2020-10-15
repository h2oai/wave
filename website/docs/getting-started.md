---
title: Introduction
---

H2O Wave lets you build and deploy amazing realtime analytics with dramatically less effort.

## What is H2O Wave?

H2O Wave is a software stack for building beautiful, low-latency, realtime, browser-based applications and dashboards entirely in Python without using HTML, Javascript or CSS.

It excels at capturing data, visualizations, and graphics from multiple sources, and broadcasting them live over the web.

<video autoplay='autoplay' loop='loop' muted='muted'><source src={require('./assets/getting-started__dashboard.mp4').default} type='video/mp4'/></video>

## What can I do with it?

H2O Wave gives your Python programs the ability to push content to connected clients as it happens, in realtime. In other words, it lets your program display up-to-date information without asking your users to hit their browser's reload button.

You can use H2O Wave for:
- Dashboards and visualizations for live monitoring.
- Live information displays: news, tickers, health, or performance data.
- Apps that require instant notifications, updates, events, or alerts.
- Apps that involve messaging: chat, bots, etc.
- Collaborative apps: whiteboards, sharing, etc.

You can also use H2O Wave when you find yourself reaching for a web application framework - it can handle regular (non-realtime) apps just fine.

## How do I use it?

H2O Wave's mental model is simple, but powerful[^1]: 
1. Your instance holds a collection of pages.
2. To change a page, simply grab a reference to a page, change it, and save it. 

That's it. Your changes are now visible to everyone.

This simplicity makes it fast, fun and easy to rapidly build and deploy interactive applications without having to reason about client/server, HTTP request/response, browser quirks, and front-end development. 

The API is concise and elegant, freeing you to create in broad strokes, tackling high level ideas first, and polishing up the details later.

## Show me some code!

Here's a bean counter. Clicking the button increments the bean count:

<video autoplay='autoplay' loop='loop' muted='muted'><source src={require('./assets/getting-started__beans.mp4').default} type='video/mp4'/></video>

And here's how it's written:

```py {8-9,16}
from h2o_wave import Q, listen, ui

bean_count = 0

async def serve(q: Q):
    global bean_count
    # Was the 'increment' button clicked?
    if q.args.increment:
        bean_count += 1

    # Display a form on the page
    q.page['beans'] = ui.form_card(
        box='1 1 1 2',
        items=[
            ui.text_xl('Beans!'),
            ui.button(name='increment', label=f'{bean_count} beans'),
        ],
    )
    
    # Save the page
    await q.page.save()

listen('/counter', serve)
```

## What's included?

The SDK ships batteries-included with a wide variety of user interface widgets and charts. You also get to use your favorite Python libraries seamlessly - anything that works in a Jupyter notebook works in H2O Wave - including Altair, Bokeh, H2O, Keras, Matplotlib, Plotly, PyTorch, Seaborn, TensorFlow, Vega-lite, and others. H2O Wave lets you use and broadcast results from all these libraries, in realtime.

H2O Wave is not only a programming toolkit but a programmable content server  as well: it can capture, retain, and relay information efficiently in realtime. The content server (or *Wave Server*) is written in Go, a ~10MB static executable without runtime dependencies[^2]. It currently ships with a Python language driver, but is language-agnostic (an R language driver is under development).

The Wave Server stores all the content and acts as a hub between your user's web browser and your apps. Therefore, it must be up and running before you launch Wave apps. Typically, you only need one Wave Server to serve several apps.

``` 
                                      +---------+
                       +------------->+ app1.py |
                       |              +---------+
                       |
+---------+       +----+-----+        +---------+
| Browser +------>+  Server  +------->+ app2.py |
+---------+       +----+-----+        +---------+
                       |
                       |              +---------+
                       +------------->+ app3.py |
                                      +---------+

```




## In Summary

H2O Wave is rapid application development for a more... civilized age[^3].

Also, this page was mostly hyperbole, so let's download it and take it for a spin, shall we.

---

[^1] The model parallels [retained mode](https://en.wikipedia.org/wiki/Retained_mode) graphics, with compositing performed on an remote server.

[^2] Runs anywhere Go executables run, which is [almost everywhere](https://gist.github.com/asukakenji/f15ba7e588ac42795f421b48b8aede63).

[^3] Hat tip to [xkcd](https://xkcd.com/297/).
