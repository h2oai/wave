---
title: Tall Stat
keywords:
  - stats
custom_edit_url: null
---

Use stat to show off.

```py
q.page['tall_stat'] = ui.tall_gauge_stat_card(
    box='1 1 1 2',
    title='Stat title',
    value='=${{intl foo minimum_fraction_digits=2 maximum_fraction_digits=2}}',
    aux_value='={{intl bar style="percent" minimum_fraction_digits=2 maximum_fraction_digits=2}}',
    plot_color='$red',
    progress=0.5,
    data=dict(foo=0.111, bar=0.222),
)
```
