---
title: Stats
keywords:
  - form
  - stats
custom_edit_url: null
---

Stats are basically a textual pairs - title + value laid out horizontally. Their purpose is
to display contextually related values that might be of higher importance than the rest of
the textual contents. They are best used with [visualizations](/docs/showcase/visualization).

```py
q.page['example'] = ui.form_card(box='1 1 4 2', items=[
    ui.stats([
        ui.stat(label='Category 1', value='$ 123.22', caption='Caption 1'),
        ui.stat(label='Category 2', value='$ 213.45', caption='Caption 2'),
        ui.stat(label='Category 3', value='$ 963.12', caption='Caption 3'),
    ])
])
```

Check the API at [ui.stats](/docs/api/ui#stats).

## Icons

Make your stats even nicer by using [icons](https://uifabricicons.azurewebsites.net/). This component
also provides control over `icon_color`.

```py
q.page['example'] = ui.form_card(box='1 1 4 2', items=[
    ui.stats([
        ui.stat(label='Category 1', value='$ 123.22', caption='Caption 1', icon='Home'),
        ui.stat(label='Category 2', value='$ 213.45', caption='Caption 2', icon='Cake'),
        ui.stat(label='Category 3', value='$ 963.12', caption='Caption 3', icon='Heart'),
    ])
])
```

## Alignment

By default, stats are aligned to the `left`. However, this behavior can be controlled by `justify`
attr.

```py
q.page['example'] = ui.form_card(box='1 1 5 2', items=[
    ui.stats(justify='between', items=[
        ui.stat(label='Category 1', value='$ 123.22', caption='Caption 1', icon='Home'),
        ui.stat(label='Category 2', value='$ 213.45', caption='Caption 2', icon='Cake'),
        ui.stat(label='Category 3', value='$ 963.12', caption='Caption 3', icon='Heart'),
    ])
])
```

## More attention

If you feel like your stats are too important and want to make sure your users won't miss it by
any chance, use `inset` attribute, which displays the stats with a contrasting background.

```py
q.page['example'] = ui.form_card(box='1 1 4 2', items=[
    ui.stats(inset=True, items=[
        ui.stat(label='Category 1', value='$ 123.22', caption='Caption 1', icon='Home'),
        ui.stat(label='Category 2', value='$ 213.45', caption='Caption 2', icon='Cake'),
        ui.stat(label='Category 3', value='$ 963.12', caption='Caption 3', icon='Heart'),
    ])
])
```
