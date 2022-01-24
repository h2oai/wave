---
title: Wide Pie Stat
keywords:
  - stats
custom_edit_url: null
---

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
