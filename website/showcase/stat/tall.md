---
title: Tall Stats
keywords:
  - stats
custom_edit_url: null
---

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
