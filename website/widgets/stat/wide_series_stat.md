---
title: Wide Series Stat
keywords:
  - stats
custom_edit_url: null
---

Most suitable for cases when you need to fill a horizontal space with numerical values together
with data series.

Check the full API at [ui.wide_series_stat_card](/docs/api/ui#wide_series_stat_card).

## Area

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

## Interval

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
