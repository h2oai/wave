---
title: Tall Stats
keywords:
  - stats
custom_edit_url: null
---

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
