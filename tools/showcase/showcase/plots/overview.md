---
title: Overview
custom_edit_url: null
---

Wave provides a versatile plotting API based on [Leland Wilkinson's](https://en.wikipedia.org/wiki/Leland_Wilkinson) [Grammar of Graphics](http://www.springer.com/gp/book/9780387245447).

A *plot* is a layered graphic, created using `ui.plot()`. Each layer displays *marks*, described by `ui.mark()`. The layers are rendered on top of each other to produce the final plot.

`ui.mark()` describes a collection of marks, not one mark. Since each `ui.mark()` describes one layer in the plot, it follows that all the marks on a layer are of the same `type` (its *geometry*). A mark's `type` can be one of `point`, `interval`, `line`, `path`, `area`, `polygon`, `schema`, `edge`.

There are two ways to add plots to a page:

- Use a plot card (`ui.plot_card()`) and set its `plot` attribute using `ui.plot()`.
- Use a form card (`ui.form_card()`), insert a visualization (`ui.visualization()`) and set its `plot` attribute using `ui.plot()`. See [form visualization](/docs/showcase/forms/visualization) for more info.

Here's a short example that renders a scatterplot of values between [0, 1].

```py
from h2o_wave import data

q.page['example'] = ui.plot_card(
    box='1 1 4 5',
    title='Point',
    data=data('price performance', 10, rows=[
        (0.1, 0.6),
        (0.2, 0.5),
        (0.3, 0.3),
        (0.4, 0.2),
        (0.4, 0.5),
        (0.2, 0.2),
        (0.8, 0.5),
        (0.3, 0.3),
        (0.2, 0.4),
        (0.1, 0.0),
    ]),
    plot=ui.plot([ui.mark(type='point', x='=price', y='=performance')])
)
```

## Annotation layers

Wave plots are rendered in layers, one upon each other. This mechanism allows mixing multiple plots
and annotations into a single canvas.

`ui.plot()` accepts a list of marks. The following example renders annotations on top of a scatterplot.

```py
from h2o_wave import data

q.page['example'] = ui.plot_card(
    box='1 1 4 5',
    title='Numeric-Numeric',
    data=data('price performance', pack=True, rows=[
        (0.1, 0.6),
        (0.2, 0.5),
        (0.3, 0.3),
        (0.4, 0.2),
        (0.4, 0.5),
        (0.2, 0.2),
        (0.8, 0.5),
        (0.3, 0.3),
        (0.2, 0.4),
        (0.1, 0.0),
    ]),
    plot=ui.plot([
        ui.mark(type='point', x='=price', y='=performance', x_min=0, x_max=100, y_min=0, y_max=100),  # the plot
        ui.mark(x=50, y=50, label='point'),  # A single reference point
        ui.mark(x=40, label='vertical line'),
        ui.mark(y=40, label='horizontal line'),
        ui.mark(x=70, x0=60, label='vertical region'),
        ui.mark(y=70, y0=60, label='horizontal region'),
        ui.mark(x=30, x0=20, y=30, y0=20, label='rectangular region')
    ])
)
```

## Events

In order to be able to handle wave events, simply register them via `events` attribute of the
plot. Depending on the event type registered, when the event fires, it fills
`q.events.<card-name>.<event-name>` within python serve function.

Wave currently supports one plot selection event called `select_marks`. Registering and firing
this event will thus result in `q.events.example.select_marks` filled.

You can also visit [handling events section](/docs/routing#handling-events) to learn more about
advanced techniques.

```py
from h2o_wave import data

q.page['example'] = ui.plot_card(
    box='1 1 4 5',
    title='Interval, range',
    data=data('product low high', 10, rows=[
        ('P1', 22, 124),
        ('P1', 51, 580),
        ('P1', 69, 528),
        ('P1', 23, 361),
        ('P1', 44, 228),
        ('P2', 69, 418),
        ('P2', 96, 824),
        ('P2', 81, 539),
        ('P2', 85, 712),
        ('P2', 18, 213),
    ]),
    events=['select_marks'],
    plot=ui.plot([ui.mark(type='interval', x='=product', y0='=low', y='=high')])
)
```

## Custom axis title

If you are not happy with the defaults provided, simply use either `x_title` or `y_title` attribute.

```py
from h2o_wave import data

q.page['example'] = ui.plot_card(
    box='1 1 4 5',
    title='Line title',
    data=data('date price', 10, rows=[
        ('2020-03-20', 124),
        ('2020-05-18', 580),
        ('2020-08-24', 528),
        ('2020-02-12', 361),
        ('2020-03-11', 228),
        ('2020-09-26', 418),
        ('2020-11-12', 824),
        ('2020-12-21', 539),
        ('2020-03-18', 712),
        ('2020-07-11', 213),
    ]),
    plot=ui.plot([
        ui.mark(type='line', x_scale='time', x='=date', y='=price',
                y_min=0, x_title='Date', y_title='Price')
    ])
)
```

