---
title: Native Area
custom_edit_url: null
---

Use area charts if total value is as important as individual values and you want
to show the relationship between these two. However, area charts work well only if
the value differences are larger, otherwise you end up with a single big area covering
most of the chart.

Check the API at [ui.plot_card](/docs/api/ui#plot_card).

```py
from h2o_wave import data

q.page['example'] = ui.plot_card(
    box='1 1 4 5',
    title='Area',
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
    plot=ui.plot([ui.mark(type='area', x_scale='time', x='=date', y='=price', y_min=0)])
)
```

## Groups

Make an area plot showing multiple categories.

```py
from h2o_wave import data

q.page['example'] = ui.plot_card(
    box='1 1 4 5',
    title='Area, stacked',
    data=data('product date price', 10, rows=[
        ('P1', '2020-03-20', 124),
        ('P2', '2020-05-18', 580),
        ('P3', '2020-08-24', 528),
        ('P1', '2020-02-12', 361),
        ('P2', '2020-03-11', 228),
        ('P3', '2020-09-26', 418),
        ('P1', '2020-11-12', 824),
        ('P2', '2020-12-21', 539),
        ('P3', '2020-03-18', 712),
        ('P1', '2020-07-11', 213),
    ]),
    plot=ui.plot([
        ui.mark(type='area', x_scale='time', x='=date', y='=price', color='=product', y_min=0)
    ])
)
```

## Stacked

Make a stacked area plot.

```py
from h2o_wave import data

q.page['example'] = ui.plot_card(
    box='1 1 4 5',
    title='Area, stacked',
    data=data('product date price', 10, rows=[
        ('P1', '2020-03-20', 124),
        ('P2', '2020-05-18', 580),
        ('P3', '2020-08-24', 528),
        ('P1', '2020-02-12', 361),
        ('P2', '2020-03-11', 228),
        ('P3', '2020-09-26', 418),
        ('P1', '2020-11-12', 824),
        ('P2', '2020-12-21', 539),
        ('P3', '2020-03-18', 712),
        ('P1', '2020-07-11', 213),
    ]),
    plot=ui.plot([
        ui.mark(type='area', x_scale='time', x='=date', y='=price', y_min=0, color='=product', stack='auto')
    ])
)
```

## Range

Make an area plot representing a range (band) of values.

```py
from h2o_wave import data

q.page['example'] = ui.plot_card(
    box='1 1 4 5',
    title='Area, range',
    data=data('date low high', 10, rows=[
        ('2020-03-20', 22, 124),
        ('2020-05-18', 51, 580),
        ('2020-08-24', 69, 528),
        ('2020-02-12', 23, 361),
        ('2020-03-11', 44, 228),
        ('2020-09-26', 69, 418),
        ('2020-11-12', 96, 824),
        ('2020-12-21', 81, 539),
        ('2020-03-18', 85, 712),
        ('2020-07-11', 18, 213),
    ]),
    plot=ui.plot([ui.mark(type='area', x_scale='time', x='=date', y0='=low', y='=high')])
)
```

## Negative

Make an area plot showing positive and negative values.

```py
from h2o_wave import data

q.page['example'] = ui.plot_card(
    box='1 1 4 5',
    title='Area, negative values',
    data=data('date price', 10, rows=[
        ('2020-03-20', 124),
        ('2020-05-18', -580),
        ('2020-08-24', 528),
        ('2020-02-12', 361),
        ('2020-03-11', -228),
        ('2020-09-26', -418),
        ('2020-11-12', -824),
        ('2020-12-21', 539),
        ('2020-03-18', 712),
        ('2020-07-11', 213),
    ]),
    plot=ui.plot([ui.mark(type='area', x_scale='time', x='=date', y='=price')])
)
```

## Smooth

Make an area plot with a smooth curve.

```py
from h2o_wave import data

q.page['example'] = ui.plot_card(
    box='1 1 4 5',
    title='Area, negative values',
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
    plot=ui.plot([ui.mark(type='area', x_scale='time', x='=date', y='=price', curve='smooth', y_min=0)])
)
```

## Line

Make an area plot with an additional line layer on top.

```py
from h2o_wave import data

q.page['example'] = ui.plot_card(
    box='1 1 4 5',
    title='Area + Line',
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
        ui.mark(type='area', x_scale='time', x='=date', y='=price', y_min=0),
        ui.mark(type='line', x='=date', y='=price')
    ])
)
```

### Line groups

Make an combined area + line plot showing multiple categories.

```py
from h2o_wave import data

q.page['example'] = ui.plot_card(
    box='1 1 4 5',
    title='Area + Line, groups',
    data=data('product date price', 10, rows=[
        ('P1', '2020-03-20', 124),
        ('P2', '2020-05-18', 580),
        ('P3', '2020-08-24', 528),
        ('P1', '2020-02-12', 361),
        ('P2', '2020-03-11', 228),
        ('P3', '2020-09-26', 418),
        ('P1', '2020-11-12', 824),
        ('P2', '2020-12-21', 539),
        ('P3', '2020-03-18', 712),
        ('P1', '2020-07-11', 213),
    ]),
    plot=ui.plot([
        ui.mark(type='area', x_scale='time', x='=date', y='=price', color='=product', y_min=0),
        ui.mark(type='line', x='=date', y='=price', color='=product')
    ])
)
```

### Line smooth

Make a combined area + line plot using a smooth `curve`.

```py
from h2o_wave import data

q.page['example'] = ui.plot_card(
    box='1 1 4 5',
    title='Area + Line, smooth',
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
        ui.mark(type='area', x_scale='time', x='=date', y='=price', curve='smooth', y_min=0),
        ui.mark(type='line', x='=date', y='=price', curve='smooth')
    ])
)
```
