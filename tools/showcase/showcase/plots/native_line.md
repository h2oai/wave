---
title: Native Line
custom_edit_url: null
---

Used to track changes over periods of time and also compare with other changes (more lines within same plot).
Better than bar charts for small changes.

```py
from h2o_wave import data

q.page['example'] = ui.plot_card(
    box='1 1 4 5',
    title='Line, groups',
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
    plot=ui.plot([ui.mark(type='line', x_scale='time', x='=date', y='=price', y_min=0)])
)
```

Check the API at [ui.plot_card](/docs/api/ui#plot_card).

## Groups

Use `color` attribute to group by a categorical column.

```py
from h2o_wave import data

q.page['example'] = ui.plot_card(
    box='1 1 4 5',
    title='Line',
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
    plot=ui.plot([ui.mark(type='line', x_scale='time', x='=date', y='=price', color='=product', y_min=0)])
)
```

## Curves

Don't like sharp edges? Just play around with `curve` attribute. Allowed values are `smooth`,
`step`, `step-after` and `step-before`.

### Smooth

```py
from h2o_wave import data

q.page['example'] = ui.plot_card(
    box='1 1 4 5',
    title='Line, smooth',
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
        ui.mark(type='line', x_scale='time', x='=date', y='=price', curve='smooth', y_min=0)
    ])
)
```

### Step

```py
from h2o_wave import data

q.page['example'] = ui.plot_card(
    box='1 1 4 5',
    title='Line, step',
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
        ui.mark(type='line', x_scale='time', x='=date', y='=price', curve='step', y_min=0)
    ])
)
```

### Step after

```py
from h2o_wave import data

q.page['example'] = ui.plot_card(
    box='1 1 4 5',
    title='Line, step-after',
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
        ui.mark(type='line', x_scale='time', x='=date', y='=price', curve='step-after', y_min=0)
    ])
)
```

### Step before

```py
from h2o_wave import data

q.page['example'] = ui.plot_card(
    box='1 1 4 5',
    title='Line, step before',
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
        ui.mark(type='line', x_scale='time', x='=date', y='=price', curve='step-before', y_min=0)
    ])
)
```

## Labels

Add labels to a line plot.

```py
from h2o_wave import data

q.page['example'] = ui.plot_card(
    box='1 1 4 5',
    title='Line, labels',
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
        ui.mark(type='line', x_scale='time', x='=date', y='=price', y_min=0,
                label='=${{intl price minimum_fraction_digits=2 maximum_fraction_digits=2}}')
    ])
)
```

### No overlap

Make a line plot with non-overlapping labels.

```py
from h2o_wave import data

q.page['example'] = ui.plot_card(
    box='1 1 4 5',
    title='Line, labels',
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
      ui.mark(type='line', x_scale='time', x='=date', y='=price', y_min=0,
              label='=${{intl price minimum_fraction_digits=2 maximum_fraction_digits=2}}',
              label_overlap='hide')
    ])
)
```

### Custom labels

Customize label rendering to improve readability.

```py
from h2o_wave import data

q.page['example'] = ui.plot_card(
    box='1 1 4 5',
    title='Line, labels',
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
      ui.mark(type='line', x_scale='time', x='=date', y='=price', y_min=0,
              label='=${{intl price minimum_fraction_digits=2 maximum_fraction_digits=2}}',
              label_fill_color='rgba(0,0,0,0.65)', label_stroke_color='$blue', label_stroke_size=2)
    ])
)
```
