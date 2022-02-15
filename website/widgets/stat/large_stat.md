---
title: Large Stat
keywords:
  - stats
custom_edit_url: null
---

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
