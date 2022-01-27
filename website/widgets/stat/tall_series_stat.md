---
title: Tall Series Stat
keywords:
  - stats
custom_edit_url: null
---

Most suitable for cases when you need to fill a vertical space with numerical values together
with data series.

Feel free to play around with the `plot_curve` attribute in order to find the curve that suits you the most.

Check the full API at [ui.tall_series_stat_card](/docs/api/ui#tall_series_stat_card).

## With line

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

## With curve

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

## With step

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

## With step-after

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

## With step-before

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

## With bars

```py
from h2o_wave import data

q.page['example'] = ui.tall_series_stat_card(
        box='1 1 2 2',
        title='With bars',
        value='=${{intl qux minimum_fraction_digits=2 maximum_fraction_digits=2}}',
        aux_value='={{intl quux style="percent" minimum_fraction_digits=1 maximum_fraction_digits=1}}',
        data=dict(qux=800, quux=80 / 100),
        plot_type='area',
        plot_category='foo',
        plot_value='qux',
        plot_color='$yellow',
        plot_data=data('foo qux', 3, rows=[[90, 0.9], [50, 0.5], [80, 0.8]]),
        plot_zero_value=0,
)
```
