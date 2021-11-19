---
title: Wide Stats
keywords:
  - stats
custom_edit_url: null
---

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