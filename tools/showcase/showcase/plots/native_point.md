---
title: Native Point
custom_edit_url: null
---

Used for observing a relationship between two numeric variables and exploring common data pattterns or finding outliers.
Based on the patterns identified, the values can be visually grouped into clusters.

## Scatter

The most basic point plot. Good for relatively small datasets where
points don't overlap.

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

## Bubble plot

Make a scatterplot with mark sizes mapped to a continuous variable.

```py
from h2o_wave import data

q.page['example'] = ui.plot_card(
    box='1 1 4 5',
    title='Point',
    data=data('price performance discount', 10, rows=[
        (0.1, 0.6, 0.2),
        (0.2, 0.5, 0.3),
        (0.3, 0.3, 0.2),
        (0.4, 0.2, 0.5),
        (0.4, 0.5, 0.8),
        (0.2, 0.2, 0.7),
        (0.8, 0.5, 0.9),
        (0.3, 0.3, 0.3),
        (0.2, 0.4, 0.4),
        (0.1, 0.0, 0.9),
    ]),
    plot=ui.plot([ui.mark(type='point', x='=price', y='=performance', size='=discount')])
)
```

## Shapes

Make a scatterplot with categories encoded as mark shapes.

```py
from h2o_wave import data

q.page['example'] = ui.plot_card(
    box='1 1 4 5',
    title='Point',
    data=data('price performance type', 10, rows=[
        (0.1, 0.6, 'T1'),
        (0.2, 0.5, 'T1'),
        (0.3, 0.3, 'T1'),
        (0.4, 0.2, 'T1'),
        (0.4, 0.5, 'T1'),
        (0.2, 0.2, 'T2'),
        (0.8, 0.5, 'T2'),
        (0.3, 0.3, 'T2'),
        (0.2, 0.4, 'T2'),
        (0.1, 0.0, 'T2'),
    ]),
    plot=ui.plot([ui.mark(type='point', x='=price', y='=performance', shape='=type')])
)
```

## Heatmap

For cases when you have just too many points which overlap and together create just a single big
point, it migh be a better idea to use a heat map.

```py
from h2o_wave import data

q.page['example'] = ui.plot_card(
    box='1 1 4 5',
    title='Heatmap',
    data=data('country product profit', 10, rows=[
        ('China', 'car', 214),
        ('USA', 'bus', 523),
        ('USA', 'car', 532),
        ('China', 'bus', 799),
        ('USA', 'car', 234),
        ('China', 'bus', 214),
        ('USA', 'car', 936),
        ('USA', 'bus', 703),
        ('China', 'car', 259),
        ('USA', 'bus', 104),
    ]),
    plot=ui.plot([ui.mark(type='polygon', x='=country', y='=product', color='=profit',
                color_range='#fee8c8 #fdbb84 #e34a33')])
)
```

## Map

Make a plot to compare quantities across categories. Similar to a heatmap,
but using size-encoding instead of color-encoding.

```py
from h2o_wave import data

q.page['example'] = ui.plot_card(
    box='1 1 4 5',
    title='Points, size-encoded',
    data=data('country product profit', 10, rows=[
        ('China', 'car', 214),
        ('USA', 'bus', 523),
        ('USA', 'car', 532),
        ('China', 'bus', 799),
        ('USA', 'car', 234),
        ('China', 'bus', 214),
        ('USA', 'car', 936),
        ('USA', 'bus', 703),
        ('China', 'car', 259),
        ('USA', 'bus', 104),
    ]),
    plot=ui.plot([ui.mark(type='point', x='=country', y='=product', size='=profit', shape='circle')])
)
```

## Groups

Make a scatterplot with categories encoded as colors.

```py
from h2o_wave import data

q.page['example'] = ui.plot_card(
    box='1 1 4 5',
    title='Point, groups',
    data=data('product price profit', 10, rows=[
        ('P1', 124.4, 214),
        ('P2', 580.4, 523),
        ('P3', 528, 532),
        ('P1', 361, 799),
        ('P2', 228, 234),
        ('P3', 418, 214),
        ('P1', 824, 936),
        ('P2', 539, 703),
        ('P3', 712, 259),
        ('P1', 213, 104),
    ]),
    plot=ui.plot([ui.mark(type='point', x='=price', y='=profit', color='=product', shape='circle')])
)
```

## Customization

Customize a plot's fill/stroke color, size and opacity.

```py
from h2o_wave import data

q.page['example'] = ui.plot_card(
    box='1 1 4 5',
    title='Point',
    data=data('price performance discount', 10, rows=[
        (0.1, 0.6, 0.2),
        (0.2, 0.5, 0.3),
        (0.3, 0.3, 0.2),
        (0.4, 0.2, 0.5),
        (0.4, 0.5, 0.8),
        (0.2, 0.2, 0.7),
        (0.8, 0.5, 0.9),
        (0.3, 0.3, 0.3),
        (0.2, 0.4, 0.4),
        (0.1, 0.0, 0.9),
    ]),
    plot=ui.plot([ui.mark(type='point', x='=price', y='=performance', size='=discount', size_range='4 30',
                          fill_color='#eb4559', stroke_color='#eb4559', stroke_size=1, fill_opacity=0.3,
                          stroke_opacity=1)])
)
```

## Annotations

Add annotations (points, lines and regions) to a plot.

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
