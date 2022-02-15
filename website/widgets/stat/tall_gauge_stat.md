---
title: Tall Gauge Stat
keywords:
  - stats
custom_edit_url: null
---

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