---
title: Table Stat
keywords:
  - stats
  - table
custom_edit_url: null
---

Use this stat if you need to display simple tabular data and don't need the full capabilities of `ui.table`.
Values can have custom font colors provided in hexadecimal, [hsl](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/hsl), [rgb](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/rgb), [browser supported keywords](https://www.w3.org/wiki/CSS/Properties/color/keywords) (red, blue, green, etc), [Spectrum pallete](https://github.com/h2oai/wave/blob/main/ui/src/index.scss#L63-L81).

```py
q.page['example'] = ui.stat_table_card(
    box='1 1 4 7',
    title='Contacts',
    subtitle=f'Last updated: 2022-04-13',
    columns=['Name', 'Job', 'City'],
    items=[
          ui.stat_table_item(
              label='Joe Doe',
              values=['Software Developer', 'New York'],
              colors=['darkblue', '$amber']
          )
    ]
)
```
