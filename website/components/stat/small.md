---
title: Small Stats
keywords:
  - stats
custom_edit_url: null
---

## Small stat

Use this stat, if you want to display a single value only and nothing else.

```py
q.page['example'] = ui.small_stat_card(box='1 1 1 1', title='Stat title', value='99.99')
```

Check the full API at [ui.small_stat_card](/docs/api/ui#small_stat_card).

## Small series stat

If you need more than textual content and want to display also how is your data trending, use series stat.

Series stats can be either an area with different `plot_curve`s or an interval depending on how you want to visualize the data.

Check the full API at [ui.small_series_stat_card](/docs/api/ui#small_series_stat_card).

### Small series area linear curve

```py
from h2o_wave import data

q.page['linear'] = ui.small_series_stat_card(
    box='1 1 2 2',
    title='Linear curve',
    value='=${{intl qux minimum_fraction_digits=2 maximum_fraction_digits=2}}',
    data=dict(qux='80'),
    plot_type='area',
    plot_value='qux',
    plot_color='$cyan',
    plot_data=data('foo qux', 3, rows=[[90, 0.9], [50, 0.5], [80, 0.8]]),
    plot_zero_value=0,
    plot_curve='linear',
)
```

### Small series area smooth curve

```py
from h2o_wave import data

q.page['smooth'] = ui.small_series_stat_card(
    box='1 1 2 2',
    title='Smooth curve',
    value='=${{intl qux minimum_fraction_digits=2 maximum_fraction_digits=2}}',
    data=dict(qux='80'),
    plot_type='area',
    plot_value='qux',
    plot_color='$azure',
    plot_data=data('foo qux', 3, rows=[[90, 0.9], [50, 0.5], [80, 0.8]]),
    plot_zero_value=0,
    plot_curve='smooth',
)
```

### Small series area step curve

```py
from h2o_wave import data

q.page['step'] = ui.small_series_stat_card(
    box='1 1 2 2',
    title='Step curve',
    value='=${{intl qux minimum_fraction_digits=2 maximum_fraction_digits=2}}',
    data=dict(qux='80'),
    plot_type='area',
    plot_value='qux',
    plot_color='$mint',
    plot_data=data('foo qux', 3, rows=[[90, 0.9], [50, 0.5], [80, 0.8]]),
    plot_zero_value=0,
    plot_curve='step',
)
```

### Small series area step-after curve

```py
from h2o_wave import data

q.page['step-after'] = ui.small_series_stat_card(
    box='1 1 2 2',
    title='Step-after curve',
    value='=${{intl qux minimum_fraction_digits=2 maximum_fraction_digits=2}}',
    data=dict(qux='80'),
    plot_type='area',
    plot_value='qux',
    plot_color='$blue',
    plot_data=data('foo qux', 3, rows=[[90, 0.9], [50, 0.5], [80, 0.8]]),
    plot_zero_value=0,
    plot_curve='step-after',
)
```

### Small series area step-before curve

```py
from h2o_wave import data

q.page['step-before'] = ui.small_series_stat_card(
    box='1 1 2 2',
    title='Step-before curve',
    value='=${{intl qux minimum_fraction_digits=2 maximum_fraction_digits=2}}',
    data=dict(qux='80'),
    plot_type='area',
    plot_value='qux',
    plot_color='$blue',
    plot_data=data('foo qux', 3, rows=[[90, 0.9], [50, 0.5], [80, 0.8]]),
    plot_zero_value=0,
    plot_curve='step-before',
)
```

### Small series area interval

If you need more than textual content and want to display also how is your data trending.

```py
from h2o_wave import data

q.page['example'] = ui.small_series_stat_card(
    box='1 1 2 2',
    title='Interval',
    value='=${{intl qux minimum_fraction_digits=2 maximum_fraction_digits=2}}',
    data=dict(qux=788.42, quux=0.65),
    plot_category='foo',
    plot_type='interval',
    plot_value='qux',
    plot_color='$cyan',
    plot_data=data('foo qux', 3, rows=[[90, 0.9], [50, 0.5], [80, 0.8]]),
    plot_zero_value=0,
)
```

Check the full API at [ui.small_series_stat_card](/docs/api/ui#small_series_stat_card).
