---
title: Vega Visualization
keywords:
  - form
  - vega-visualization
custom_edit_url: null
---

[Vega lite](https://vega.github.io/vega-lite/) visualizations.

```py
from h2o_wave import data

spec = '''
{
  "description": "A simple bar plot with embedded data.",
  "data": {
    "values": [
      {"a": "A","b": 28}, {"a": "B","b": 55}, {"a": "C","b": 43},
      {"a": "D","b": 91}, {"a": "E","b": 81}, {"a": "F","b": 53},
      {"a": "G","b": 19}, {"a": "H","b": 87}, {"a": "I","b": 52}
    ]
  },
  "mark": "bar",
  "encoding": {
    "x": {"field": "a", "type": "ordinal"},
    "y": {"field": "b", "type": "quantitative"}
  }
}
'''

q.page['example'] = ui.form_card(box='1 1 2 4', items=[
    ui.vega_visualization(
        specification=spec,
        data=data(fields=['a', 'b'], pack=True, rows=[
            ["A", 10], ["B", 20], ["C", 30],
            ["D", 40], ["E", 50], ["F", 60],
            ["G", 70], ["H", 80], ["I", 90]
        ]),
    ),
])
```

Check the API at [ui.vega_visualization](/docs/api/ui#vega_visualization).

## Dimensions

In addition to `width` attribute that is present on every form component, vega visualization also provides
a way to control height via `height` attribute, which defaults to `300px`. It supports all the
[CSS units](https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Values_and_units),
however, `%` may not always work as you could expect so we advise to use static units like `px`,
`rem` etc. instead.

```py
from h2o_wave import data

spec = '''
{
  "description": "A simple bar plot with embedded data.",
  "data": {
    "values": [
      {"a": "A","b": 28}, {"a": "B","b": 55}, {"a": "C","b": 43},
      {"a": "D","b": 91}, {"a": "E","b": 81}, {"a": "F","b": 53},
      {"a": "G","b": 19}, {"a": "H","b": 87}, {"a": "I","b": 52}
    ]
  },
  "mark": "bar",
  "encoding": {
    "x": {"field": "a", "type": "ordinal"},
    "y": {"field": "b", "type": "quantitative"}
  }
}
'''

q.page['example'] = ui.form_card(box='1 1 2 4', items=[
    ui.vega_visualization(
        width='200px',
        height='200px',
        specification=spec,
        data=data(fields=['a', 'b'], pack=True, rows=[
            ["A", 10], ["B", 20], ["C", 30],
            ["D", 40], ["E", 50], ["F", 60],
            ["G", 70], ["H", 80], ["I", 90]
        ]),
    ),
])
```
