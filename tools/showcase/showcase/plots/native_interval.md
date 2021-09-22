---
title: Native Interval
custom_edit_url: null
---

Create interval plots, usually bar charts. Interval plots are good for showing how
your data is trending.

```py
from h2o_wave import data

q.page['example'] = ui.plot_card(
    box='1 1 4 5',
    title='Interval',
    data=data('product price', 10, rows=[
        ('P1', 124),
        ('P2', 580),
        ('P3', 528),
        ('P1', 361),
        ('P2', 228),
        ('P3', 418),
        ('P1', 824),
        ('P2', 539),
        ('P3', 712),
        ('P1', 213),
    ]),
    plot=ui.plot([ui.mark(type='interval', x='=product', y='=price', y_min=0)])
)
```

Check the API at [ui.plot_card](/docs/api/ui#plot_card).

## Transpose

In order to transpose the plot, simply switch the `x` and `y` coordinate values.

```py
from h2o_wave import data

q.page['example'] = ui.plot_card(
    box='1 1 4 5',
    title='Interval transposed',
    data=data('product price', 10, rows=[
        ('P1', 124),
        ('P2', 580),
        ('P3', 528),
        ('P1', 361),
        ('P2', 228),
        ('P3', 418),
        ('P1', 824),
        ('P2', 539),
        ('P3', 712),
        ('P1', 213),
    ]),
    plot=ui.plot([ui.mark(type='interval', x='=price', y='=product', y_min=0)])
)
```

## Theta

Make a "racetrack" plot (a bar plot in polar coordinates, transposed).

```py
from h2o_wave import data

q.page['example'] = ui.plot_card(
    box='1 1 4 5',
    title='Intervals, theta, stacked',
    data=data('country product price', 10, rows=[
        ('USA', 'P1', 124),
        ('China', 'P2', 580),
        ('USA', 'P3', 528),
        ('China', 'P1', 361),
        ('USA', 'P2', 228),
        ('China', 'P3', 418),
        ('USA', 'P1', 824),
        ('China', 'P2', 539),
        ('USA', 'P3', 712),
        ('USA', 'P1', 213),
    ]),
    plot=ui.plot([
        ui.mark(
            coord='theta',
            type='interval', 
            x='=product', 
            y='=price',
            color='=country',
            stack='auto',
            y_min=0
        )
    ])
)
```

## Stacked

Useful when you want to display third dimension to your bar charts.

```py
from h2o_wave import data

q.page['example'] = ui.plot_card(
    box='1 1 4 5',
    title='Intervals, stacked',
    data=data('country product price', 10, rows=[
        ('USA', 'P1', 124),
        ('China', 'P2', 580),
        ('USA', 'P3', 528),
        ('China', 'P1', 361),
        ('USA', 'P2', 228),
        ('China', 'P3', 418),
        ('USA', 'P1', 824),
        ('China', 'P2', 539),
        ('USA', 'P3', 712),
        ('USA', 'P1', 213),
    ]),
    plot=ui.plot([
        ui.mark(type='interval', x='=product', y='=price', color='=country', stack='auto', y_min=0)
    ])
)
```

## Stacked grouped

Make a column plot with both stacked and grouped bars.

```py
from h2o_wave import data

q.page['example'] = ui.plot_card(
    box='1 1 4 5',
    title='Intervals, stacked and dodged',
    data=data('category country product price', 10, rows=[
        ('G1', 'USA', 'P1', 124),
        ('G1', 'China', 'P2', 580),
        ('G1', 'USA', 'P3', 528),
        ('G1', 'China', 'P1', 361),
        ('G1', 'USA', 'P2', 228),
        ('G2', 'China', 'P3', 418),
        ('G2', 'USA', 'P1', 824),
        ('G2', 'China', 'P2', 539),
        ('G2', 'USA', 'P3', 712),
        ('G2', 'USA', 'P1', 213),
    ]),
    plot=ui.plot([
        ui.mark(
            type='interval',
            x='=product',
            y='=price',
            color='=country',
            stack='auto',
            dodge='=category',
            y_min=0
        )
    ])
)
```

## Range

Make a column plot with each bar representing high/low (or start/end) values.
Transposing this produces a gantt plot.

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
    plot=ui.plot([ui.mark(type='interval', x='=product', y0='=low', y='=high')])
)
```

## Polar

Make a rose plot (a bar plot in polar coordinates).

```py
from h2o_wave import data

q.page['example'] = ui.plot_card(
    box='1 1 4 5',
    title='Interval, polar',
    data=data('product price', 10, rows=[
        ('P1', 124),
        ('P2', 580),
        ('P3', 528),
        ('P1', 361),
        ('P2', 228),
        ('P3', 418),
        ('P1', 824),
        ('P2', 539),
        ('P3', 712),
        ('P1', 213),
    ]),
    plot=ui.plot([ui.mark(coord='polar', type='interval', x='=product', y='=price', y_min=0)])
)
```

## Polar stacked

Make a stacked rose plot (a stacked bar plot in polar coordinates).

```py
from h2o_wave import data

q.page['example'] = ui.plot_card(
    box='1 1 4 5',
    title='Intervals, polar, stacked',
    data=data('country product price', 10, rows=[
        ('USA', 'P1', 124),
        ('China', 'P2', 580),
        ('USA', 'P3', 528),
        ('China', 'P1', 361),
        ('USA', 'P2', 228),
        ('China', 'P3', 418),
        ('USA', 'P1', 824),
        ('China', 'P2', 539),
        ('USA', 'P3', 712),
        ('USA', 'P1', 213),
    ]),
    plot=ui.plot([
        ui.mark(
            coord='polar',
            type='interval',
            x='=product',
            y='=price',
            color='=country',
            stack='auto',
            y_min=0
        )
    ])
)
```

## Labels

Make a column plot with labels on each bar.

```py
from h2o_wave import data

q.page['example'] = ui.plot_card(
    box='1 1 4 5',
    title='Label Customization',
    data=data('product price', 10, rows=[
        ('P1', 124),
        ('P2', 580),
        ('P3', 528),
        ('P1', 361),
        ('P2', 228),
        ('P3', 418),
        ('P1', 824),
        ('P2', 539),
        ('P3', 712),
        ('P1', 213),
    ]),
    plot=ui.plot([
        ui.mark(
            type='interval', 
            x='=product',
            y='=${{intl price minimum_fraction_digits=2 maximum_fraction_digits=2}}', y_min=0,
            color='#333333',
            label='=${{intl price minimum_fraction_digits=2 maximum_fraction_digits=2}}',
            label_offset=0, label_position='middle', label_rotation='-90', label_fill_color='#fff',
            label_font_weight='bold'
        )
    ])
)
```

## Helix

Make a bar plot in helical coordinates.

```py
from h2o_wave import data

q.page['example'] = ui.plot_card(
    box='1 1 4 5',
    title='Interval, helix',
    data=data('product price', 10, rows=[ (f'P{i}', i) for i in range(200)]),
    plot=ui.plot([ui.mark(coord='helix', type='interval', x='=product', y='=price', y_min=0)])
)
```

## Groups

Make a grouped column plot.

```py
from h2o_wave import data

q.page['example'] = ui.plot_card(
    box='1 1 4 5',
    title='Intervals, groups',
    data=data('country product price', 10, rows=[
        ('USA', 'P1', 124),
        ('China', 'P2', 580),
        ('USA', 'P3', 528),
        ('China', 'P1', 361),
        ('USA', 'P2', 228),
        ('China', 'P3', 418),
        ('USA', 'P1', 824),
        ('China', 'P2', 539),
        ('USA', 'P3', 712),
        ('USA', 'P1', 213),
    ]),
    plot=ui.plot([ui.mark(type='interval', x='=product', y='=price', color='=country', dodge='auto', y_min=0)])
)
```

## Histogram

Best used for numerical data when shape of distribution is needed.

```py
from h2o_wave import data

q.page['example'] = ui.plot_card(
    box='1 1 4 5',
    title='Interval, range',
    data=data('price low high', 10, rows=[
        (123, 22, 124),
        (471, 51, 580),
        (421, 69, 528),
        (119, 23, 361),
        (196, 44, 228),
        (123, 69, 418),
        (691, 96, 824),
        (391, 81, 539),
        (709, 85, 712),
        (123, 18, 213),
    ]),
    plot=ui.plot([ui.mark(type='interval', y='=price', x1='=low', x2='=high', y_min=0)])
)
```
