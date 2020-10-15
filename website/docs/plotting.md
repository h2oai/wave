---
title: Plots
---

Wave provides a versatile plotting API based on [Leland Wilkinson's](https://en.wikipedia.org/wiki/Leland_Wilkinson) [Grammar of Graphics](http://www.springer.com/gp/book/9780387245447).

A *plot* is a layered graphic, created using `ui.plot()`. Each layer displays *marks*, described by `ui.mark()`. The layers are rendered on top of each other to produce the final plot.

`ui.mark()` describes a collection of marks, not one mark. Since each `ui.mark()` describes one layer in the plot, it follows that all the marks on a layer are of the same `type` (its *geometry*). A mark's `type` can be one of `point`, `interval`, `line`, `path`, `area`, `polygon`, `schema`, `edge`.

There are two ways to add plots to a page:
- Use a plot card (`ui.plot_card()`) and set its `plot` attribute using `ui.plot()`.
- Use a form card (`ui.form_card()`), insert a visualization (`ui.visualization()`) and set its `plot` attribute using `ui.plot()`.

Here's a short example that renders a scatterplot of random values between [0, 1].

```py
import random
from h2o_wave import site, data, ui

page = site['/demo']

v = page.add('example', ui.plot_card(
    box='1 1 4 5',
    title='Point',
    data=data('price performance', 50, rows=[(random.random(), random.random()) for _ in range(50)]),
    plot=ui.plot([
        ui.mark(type='point', x='=price', y='=performance')
    ])
))
page.save()
```

`ui.plot()` accepts a list of marks. [This example](examples/plot-point-annotation) renders annotations on top of a scatterplot, like this:

```py
ui.plot([
    ui.mark(type='point', x='=price', y='=performance', x_min=0, x_max=100, y_min=0, y_max=100),  # the plot
    ui.mark(x=50, y=50, label='point'),
    ui.mark(x=40, label='vertical line'),
    ui.mark(y=40, label='horizontal line'),
    ui.mark(x=70, x0=60, label='vertical region'),
    ui.mark(y=70, y0=60, label='horizontal region'),
    ui.mark(x=30, x0=20, y=30, y0=20, label='rectangular region')
])
```

## Point

- [Basic](examples/plot-point): Make a scatterplot.
- [Shapes](examples/plot-point-shapes): Make a scatterplot with categories encoded as mark shapes.
- [Sizes](examples/plot-point-sizes): Make a scatterplot with mark sizes mapped to a continuous variable (a "bubble plot").
- [Map](examples/plot-point-map): Make a plot to compare quantities across categories. Similar to a heatmap, but using size-encoding instead of color-encoding.
- [Groups](examples/plot-point-groups): Make a scatterplot with categories encoded as colors.
- [Annotation](examples/plot-point-annotation): Add annotations (points, lines and regions) to a plot.
- [Custom](examples/plot-point-custom): Customize a plot's fill/stroke color, size and opacity.

## Interval

### Columns

- [Basic](examples/plot-interval): Make a column plot.
- [Groups](examples/plot-interval-groups): Make a grouped column plot.
- [Range](examples/plot-interval-range): Make a column plot with each bar representing high/low (or start/end) values. Transposing this produces a gantt plot.
- [Labels](examples/plot-interval-labels): Make a column plot with labels on each bar.
- [Stacked](examples/plot-interval-stacked): Make a stacked column plot.
- [Stacked, Grouped](examples/plot-interval-stacked-grouped): Make a column plot with both stacked and grouped bars.
- [Annotation](examples/plot-interval-annotation): Add annotations to a column plot.
- [Theta](examples/plot-interval-theta): Make a "racetrack" plot (a column plot in polar coordinates).

### Bars

- [Basic](examples/plot-interval-transpose): Make a bar plot.
- [Groups](examples/plot-interval-groups-transpose): Make a grouped bar plot.
- [Range](examples/plot-interval-range-transpose): Make a bar plot with each bar representing high/low (or start/end) values. Transposing this produces a gantt plot.
- [Stacked](examples/plot-interval-stacked-transpose): Make a stacked bar plot.
- [Stacked, Grouped](examples/plot-interval-stacked-grouped-transpose): Make a bar plot with both stacked and grouped bars.
- [Annotation](examples/plot-interval-annotation-transpose): Add annotations to a bar plot.
- [Polar](examples/plot-interval-polar): Make a rose plot (a bar plot in polar coordinates).
- [Polar, Stacked](examples/plot-interval-polar-stacked): Make a stacked rose plot (a stacked bar plot in polar coordinates).
- [Helix](examples/plot-interval-helix): Make a bar plot in helical coordinates.

## Line

- [Basic](examples/plot-line): Make a line plot.
- [Groups](examples/plot-line-groups): Make a multi-series line plot.
- [Smooth](examples/plot-line-smooth): Make a line plot using a smooth curve.
- [Step](examples/plot-step): Make a line plot with a step curve.
- [Step, After](examples/plot-step-after): Make a line plot with a step-after curve.
- [Step, Before](examples/plot-step-before): Make a line plot with a step-before curve.
- [Labels](examples/plot-line-labels): Add labels to a line plot.
- [Labels, Stroked](examples/plot-line-labels-stroked): Customize label rendering: add a subtle outline to labels to improve readability.
- [Labels, Occlusion](examples/plot-line-labels-no-overlap): Make a line plot with non-overlapping labels.
- [Annotation](examples/plot-line-annotation): Add annotations to a line plot.

## Path

- [Basic](examples/plot-path): Make a path plot.
- [Point](examples/plot-path-point): Make a path plot with an additional layer of points.
- [Smooth](examples/plot-path-smooth): Make a path plot with a smooth curve.

## Area

- [Basic](examples/plot-area): Make an area plot.
- [Groups](examples/plot-area-groups): Make an area plot showing multiple categories.
- [Negative](examples/plot-area-negative): Make an area plot showing positive and negative values.
- [Range](examples/plot-area-range): Make an area plot representing a range (band) of values.
- [Smooth](examples/plot-area-smooth): Make an area plot with a smooth curve.
- [Stacked](examples/plot-area-stacked): Make a stacked area plot.

## Area + Line

- [Area + Line](examples/plot-area-line): Make an area plot with an additional line layer on top.
- [Area + Smooth](examples/plot-area-line-smooth): Make a combined area + line plot using a smooth curve.
- [Area + Groups](examples/plot-area-line-groups): Make an combined area + line plot showing multiple categories.

## Polygon

- [Basic](examples/plot-polygon): Make a heatmap.

## Schema
- [Histogram](examples/plot-histogram): Make a histogram.

## Other

- [Axis Titles](examples/plot-axis-title): Display custom axis titles on a plot.
- [Form](examples/plot-form): Display a plot inside a form.
