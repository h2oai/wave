---
title: Large Bar Stat
keywords:
  - stats
custom_edit_url: null
---

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
