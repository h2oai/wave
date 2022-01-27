---
title: Wide Bar Stat
keywords:
  - stats
custom_edit_url: null
---

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
