---
title: Stat Table 
keywords:
  - stats
  - table
custom_edit_url: null
---

Use this stat if you need to display simple tabular data and don't need the full capabilities of `ui.table`.

Values can have custom font colors provided in hexadecimal, [hsl](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/hsl), [rgb](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/rgb), [browser supported keywords](https://www.w3.org/wiki/CSS/Properties/color/keywords) (red, blue, green, etc), [Wave colors](/docs/color-theming/#wave-colors).

```py
values = ['Software Developer', 'New York']
colors = ['darkblue', '$amber'] 

q.page['example'] = ui.stat_table_card(
    box='1 1 4 4',
    title='Contacts',
    subtitle='Last updated: 2022-04-13',
    columns=['Name', 'Job', 'City'],
    items=[ui.stat_table_item(label='Joe Doe', values=values, colors=colors) for _ in range(5)]
)
```
