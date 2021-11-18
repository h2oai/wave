---
title: Stats
keywords:
  - stats
custom_edit_url: null
---

Stats are visual components that display textual content along with numerical values. They
are best used when resulting values need further description. The values are usually percents,
proportional ratios or just a set of values indicating a certain trend (e.g. bars, lines).

Both textual and numeric value attributes support
[data binding syntax](/docs/expressions/#functions).

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

## Large stat

Use this stat, if you want to display multiple values like primary, auxiliary and caption.

```py
q.page['example'] = ui.large_stat_card(
    box='1 1 2 2',
    title='Large stat',
    value='=${{intl qux minimum_fraction_digits=2 maximum_fraction_digits=2}}',
    aux_value='={{intl quux style="percent" minimum_fraction_digits=1 maximum_fraction_digits=1}}',
    data=dict(qux=845, quux=0.8),
    caption='There goes some longer text that would describe the values displayed above.',
)
```

Check the full API at [ui.large_stat_card](/docs/api/ui#large_stat_card).

## Large bar stat

Use this stat, if you want to display multiple values like primary, auxiliary and caption.

```py
q.page['example'] = ui.large_bar_stat_card(
    box='1 1 2 2',
    title='Large bar',
    value='=${{intl foo minimum_fraction_digits=2 maximum_fraction_digits=2}}',
    value_caption='Start',
    aux_value='={{intl bar style="percent" minimum_fraction_digits=2 maximum_fraction_digits=2}}',
    aux_value_caption='End',
    plot_color='$tangerine',
    progress=0.23,
    data=dict(foo=123, bar=0.23),
    caption='There goes some longer text that would describe the values displayed above.',
)
```

Check the full API at [ui.large_bar_stat_card](/docs/api/ui#large_bar_stat_card).

## Tall stats

Vertical label-value pairs collection. Generally used when you want to interpret the main findings, e.g. total churn.

```py
q.page['example'] = ui.tall_stats_card(
    box='1 1 2 4',
    items=[
        ui.stat(label='PARAMETER NAME', value='125%'),
        ui.stat(label='PARAMETER NAME', value='578 Users'),
        ui.stat(label='PARAMETER NAME', value='25K')
    ]
)
```

Check the full API at [ui.tall_stats_card](/docs/api/ui#tall_stats_card).

## Tall gauge stat

Best used for cases when a few numeric values need to be displayed vertically, with the main
value one being a percentage.

```py
q.page['example'] = ui.tall_gauge_stat_card(
    box='1 1 1 2',
    title='Tall gauge',
    value='=${{intl foo minimum_fraction_digits=2 maximum_fraction_digits=2}}',
    aux_value='={{intl bar style="percent" minimum_fraction_digits=2 maximum_fraction_digits=2}}',
    plot_color='$violet',
    progress=0.56,
    data=dict(foo=123, bar=0.56),
)
```

Check the full API at [ui.tall_gauge_stat_card](/docs/api/ui#tall_gauge_stat_card).

## Tall series area

Most suitable for cases when you need to fill a vertical space with numerical values together
with data series.

Feel free to play around with the `plot_curve` attribute in order to find the curve that suits you the most.

Check the full API at [ui.tall_series_stat_card](/docs/api/ui#tall_series_stat_card).

### Tall series area linear curve

```py
from h2o_wave import data

q.page['example'] = ui.tall_series_stat_card(
        box='1 1 2 2',
        title='Linear tall series',
        value='=${{intl qux minimum_fraction_digits=2 maximum_fraction_digits=2}}',
        aux_value='={{intl quux style="percent" minimum_fraction_digits=1 maximum_fraction_digits=1}}',
        data=dict(qux=800, quux=80 / 100),
        plot_type='area',
        plot_category='foo',
        plot_value='qux',
        plot_color='$yellow',
        plot_data=data('foo qux', 3, rows=[[90, 0.9], [50, 0.5], [80, 0.8]]),
        plot_zero_value=0,
        plot_curve='linear',
)
```

### Tall series area smooth curve

```py
from h2o_wave import data

q.page['example'] = ui.tall_series_stat_card(
        box='1 1 2 2',
        title='Smooth tall series',
        value='=${{intl qux minimum_fraction_digits=2 maximum_fraction_digits=2}}',
        aux_value='={{intl quux style="percent" minimum_fraction_digits=1 maximum_fraction_digits=1}}',
        data=dict(qux=800, quux=80 / 100),
        plot_type='area',
        plot_category='foo',
        plot_value='qux',
        plot_color='$yellow',
        plot_data=data('foo qux', 3, rows=[[90, 0.9], [50, 0.5], [80, 0.8]]),
        plot_zero_value=0,
        plot_curve='smooth',
)
```

### Tall series area step curve

```py
from h2o_wave import data

q.page['example'] = ui.tall_series_stat_card(
        box='1 1 2 2',
        title='Step tall series',
        value='=${{intl qux minimum_fraction_digits=2 maximum_fraction_digits=2}}',
        aux_value='={{intl quux style="percent" minimum_fraction_digits=1 maximum_fraction_digits=1}}',
        data=dict(qux=800, quux=80 / 100),
        plot_type='area',
        plot_category='foo',
        plot_value='qux',
        plot_color='$yellow',
        plot_data=data('foo qux', 3, rows=[[90, 0.9], [50, 0.5], [80, 0.8]]),
        plot_zero_value=0,
        plot_curve='step',
)
```

### Tall series area step-after curve

```py
from h2o_wave import data

q.page['example'] = ui.tall_series_stat_card(
        box='1 1 2 2',
        title='Step-after tall series',
        value='=${{intl qux minimum_fraction_digits=2 maximum_fraction_digits=2}}',
        aux_value='={{intl quux style="percent" minimum_fraction_digits=1 maximum_fraction_digits=1}}',
        data=dict(qux=800, quux=80 / 100),
        plot_type='area',
        plot_category='foo',
        plot_value='qux',
        plot_color='$yellow',
        plot_data=data('foo qux', 3, rows=[[90, 0.9], [50, 0.5], [80, 0.8]]),
        plot_zero_value=0,
        plot_curve='step-after',
)
```

### Tall series area step-before curve

```py
from h2o_wave import data

q.page['example'] = ui.tall_series_stat_card(
        box='1 1 2 2',
        title='Step-before tall series',
        value='=${{intl qux minimum_fraction_digits=2 maximum_fraction_digits=2}}',
        aux_value='={{intl quux style="percent" minimum_fraction_digits=1 maximum_fraction_digits=1}}',
        data=dict(qux=800, quux=80 / 100),
        plot_type='area',
        plot_category='foo',
        plot_value='qux',
        plot_color='$yellow',
        plot_data=data('foo qux', 3, rows=[[90, 0.9], [50, 0.5], [80, 0.8]]),
        plot_zero_value=0,
        plot_curve='step-before',
)
```

## Wide pie stat

Need a pie chart? No problem.

```py
q.page['example'] = ui.wide_pie_stat_card(
    box='1 1 3 3',
    title='Wide Pie Stat',
    pies=[
        ui.pie(label='Category 1', value='35%', fraction=0.35, color='#2cd0f5', aux_value='$ 35'),
        ui.pie(label='Category 2', value='65%', fraction=0.65, color='$green', aux_value='$ 65'),
    ]
)
```

Check the full API at [ui.wide_pie_stat_card](/docs/api/ui#wide_pie_stat_card).

## Wide bar stat

Most suitable for cases when you need to display numerical data together with a progress bar horizontally.

```py
q.page['example'] = ui.wide_bar_stat_card(
    box='1 1 2 1',
    title='Wide bar',
    value='=${{intl foo minimum_fraction_digits=2 maximum_fraction_digits=2}}',
    aux_value='={{intl bar style="percent" minimum_fraction_digits=2 maximum_fraction_digits=2}}',
    plot_color='$red',
    progress=0.34,
    data=dict(foo=86, bar=0.34),
)
```

Check the full API at [ui.wide_bar_stat_card](/docs/api/ui#wide_bar_stat_card).

## Wide gauge stat

```py
q.page['example'] = ui.wide_gauge_stat_card(
    box='1 1 2 1',
    title='Wide gauge',
    value='=${{intl foo minimum_fraction_digits=2 maximum_fraction_digits=2}}',
    aux_value='={{intl bar style="percent" minimum_fraction_digits=2 maximum_fraction_digits=2}}',
    plot_color='$red',
    progress=0.34,
    data=dict(foo=86, bar=0.34),
)
```

Check the full API at [ui.wide_gauge_stat_card](/docs/api/ui#wide_gauge_stat_card).

## Wide series stat

Most suitable for cases when you need to fill a horizontal space with numerical values together
with data series.

Check the full API at [ui.wide_series_stat_card](/docs/api/ui#wide_series_stat_card).

### Wide series area linear curve

```py
from h2o_wave import data

q.page['example'] = ui.wide_series_stat_card(
    box='1 1 2 1',
    title='Wide series',
    value='=${{intl qux minimum_fraction_digits=2 maximum_fraction_digits=2}}',
    aux_value='={{intl quux style="percent" minimum_fraction_digits=1 maximum_fraction_digits=1}}',
    data=dict(qux=80, quux=0.8),
    plot_type='area',
    plot_value='qux',
    plot_color='$green',
    plot_data=data('foo qux', 3, rows=[[90, 0.9], [50, 0.5], [80, 0.8]]),
    plot_zero_value=0,
    plot_curve='linear',
)
```

### Wide series area interval

```py
from h2o_wave import data

q.page['example'] = ui.wide_series_stat_card(
    box='1 1 2 1',
    title='Wide series',
    value='=${{intl qux minimum_fraction_digits=2 maximum_fraction_digits=2}}',
    aux_value='={{intl quux style="percent" minimum_fraction_digits=1 maximum_fraction_digits=1}}',
    data=dict(qux=80, quux=0.8),
    plot_category='foo',
    plot_type='interval',
    plot_value='qux',
    plot_color='$green',
    plot_data=data('foo qux', 3, rows=[[90, 0.9], [50, 0.5], [80, 0.8]]),
    plot_zero_value=0,
    plot_curve='linear',
)
```
