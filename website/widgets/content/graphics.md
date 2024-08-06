---
title: Graphics
keywords:
  - graphics
custom_edit_url: null
---

To render vector graphics (SVG) in your app, use the graphics card.

```py
from h2o_wave import graphics

red_square = graphics.p().m(25, 25).h(50).v(50).h(-50).z().path(fill='red')

q.page['example'] = ui.graphics_card(
    box='1 1 2 3', view_box='0 0 100 100', width='100%', height='100%',
    scene=graphics.scene(foo=red_square),
)
```

See the [Graphics](https://wave.h2o.ai/docs/graphics) section of the Guide for a detailed explanation of graphics support in Wave and find the full API at [ui.graphics_card](http://wave.h2o.ai/docs/api/ui#graphics_card).

## Background image

Set a background image on the graphics card, either by specifying the image's path or by providing base64-encoded image data.

```py
from h2o_wave import graphics

red_square = graphics.p().m(25, 25).h(50).v(50).h(-50).z().path(fill='red')

q.page['example'] = ui.graphics_card(
    box='1 1 2 3', view_box='0 0 100 100', width='100%', height='100%',
    scene=graphics.scene(foo=red_square),
    path='https://images.pexels.com/photos/1269968/pexels-photo-1269968.jpeg?auto=compress',
)
```
