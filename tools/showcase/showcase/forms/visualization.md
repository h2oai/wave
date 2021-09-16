---
title: Visualization
keywords:
  - form
  - visualization
custom_edit_url: null
---

Visualizations are charts / plots / graphs that help you better understand your data.
Wave uses [Grammar of Graphics](https://towardsdatascience.com/a-comprehensive-guide-to-the-grammar-of-graphics-for-effective-visualization-of-multi-dimensional-1f92b4ed4149) to describe its plots.

For more thorough explanation of how Wave plots work, please see [Plots overview](/docs/showcase/plots/overview).

```py
from h2o_wave import data

q.page['example'] = ui.form_card(box='1 1 4 4', items=[
    ui.visualization(
        plot=ui.plot([ui.mark(type='interval', x='=product', y='=price', y_min=0)]),
        data=data(fields='product price', pack=True, rows=[
            ('category1', 7),
            ('category2', 8),
            ('category3', 9),
        ]),
    ),
])
```

## Dimensions

In addition to `width` attribute that is present on every form component, visualization also provides
a way to control height via `height` attribute, which defaults to `300px`. It supports all the
[CSS units](https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Values_and_units),
however, `%` may not always work as you could expect so we advise to use static units like `px`,
`rem` etc. instead.

```py
from h2o_wave import data

q.page['example'] = ui.form_card(box='1 1 4 4', items=[
    ui.visualization(
        height='300px',
        plot=ui.plot([ui.mark(type='interval', x='=product', y='=price', y_min=0)]),
        data=data(fields='product price', pack=True, rows=[
            ('category1', 7),
            ('category2', 8),
            ('category3', 9),
        ]),
    ),
])
```

## Events

Wave plots provide a way to listen for user clicks on a certain parts of the
visualization. All it takes is to register the event, e.g. `events=['select_marks']` and once
the action happens, you get the appropriate data in `q.events.<name-attr>.select_marks`.

```py
from h2o_wave import data

q.page['example'] = ui.form_card(box='1 1 4 4', items=[
    ui.visualization(
        name='viz',
        height='300px',
        plot=ui.plot([ui.mark(type='interval', x='=product', y='=price', y_min=0)]),
        data=data(fields='product price', pack=True, rows=[
            ('category1', 7),
            ('category2', 8),
            ('category3', 9),
        ]),
        events=['select_marks'] # Submits q.events.viz.select_marks
    ),
])
```
