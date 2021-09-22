---
title: Stats
keywords:
  - stats
custom_edit_url: null
---

Stats are visual components that display textual content along with numerical values. They
are best used when resulting values need further description. The values are usually percents,
portional ratios or just a set of values indicating a certain trend (e.g. bars, lines).

Both textual and value attributes support
[data binding syntax](/docs/expressions/#functions).

## Small stat

Use this stat, if you want to display a single value only and nothing else.

```py
q.page['example'] = ui.small_stat_card(box='1 1 1 1', title='Stat title', value='99.99')
```

Check the API at [ui.small_stat_card](/docs/api/ui#small_stat_card).

## Small series area stat

If you need more than a textual content and want to display also how is your data trending, use series stat.

Feel free to play around with `plot_curve` attribute in order to find the curve that suits you the most.

Check the API at [ui.small_series_stat_card](/docs/api/ui#small_series_stat_card).

### Small series Linear curve

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

### Small series smooth curve

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

### Small series step curve

```py
from h2o_wave import data

q.page['step'] = ui.small_series_stat_card(
    box='1 1 2 2',
    title='Smooth curve',
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

### Small series step-after curve

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

### Small series step-before curve

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

## Small series area interval

If you need more than a textual content and want to display also how is your data trending.

```py
from h2o_wave import data

q.page['example'] = ui.small_series_stat_card(
    box='1 1 2 2',
    title='Stat Title',
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

Check the API at [ui.small_series_stat_card](/docs/api/ui#small_series_stat_card).

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

Check the API at [ui.large_stat_card](/docs/api/ui#large_stat_card).

## Large bar stat

Use this stat, if you want to display multiple values like primary, auxiliary and caption.

```py
q.page['example'] = ui.large_bar_stat_card(
    box='1 1 2 2',
    title='Large stat',
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

## Tall gauge stat

Best used for cases when a few numeric values need to be displayed in a vertical way, with the main
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

## Tall series area

Most suitable for cases when you need to fill a vertical space with numerical values together
with data series.

Check the API at [ui.tall_series_stat_card](/docs/api/ui#tall_series_stat_card).

Feel free to play around with `plot_curve` attribute in order to find the curve that suits you the most.

### Tall series linear curve

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

### Tall series smooth curve

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

### Tall series step curve

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

### Tall series step-after curve

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

### Tall series step-before curve

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

## Wide bar stat

Most suitable for cases when you need to display numerical data together with a progressbar horizontally.

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

Check the API at [ui.wide_bar_stat_card](/docs/api/ui#wide_bar_stat_card).

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

Check the API at [ui.wide_gauge_stat_card](/docs/api/ui#wide_gauge_stat_card).

## Wide series area

Most suitable for cases when you need to fill a horizontal space with numerical values together
with data series.

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

Check the API at [ui.wide_series_stat_card](/docs/api/ui#wide_series_stat_card).

## Wide series interval

Most suitable for cases when you need to fill a horizontal space with numerical values together
with data series.

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

Check the API at [ui.wide_series_stat_card](/docs/api/ui#wide_series_stat_card).
