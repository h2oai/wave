---
title: Vega lite
custom_edit_url: null
---

If you, for some reason, do not want to use native Wave plots, you can use what you already know like Vega for example.

```py
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

q.page['embedded'] = ui.vega_card(
    box='1 1 2 4',
    title='Plot with embedded data',
    specification=spec,
)
```

Check the API at [ui.vega_card](/docs/api/ui#vega_card).

## Separate spec from data

Useful for cases when you expect plot to be updated later on and don't want to recreate it each time.

```py
from h2o_wave import data

spec = '''
{
  "description": "A simple bar plot with embedded data.",
  "mark": "bar",
  "encoding": {
    "x": {"field": "a", "type": "ordinal"},
    "y": {"field": "b", "type": "quantitative"}
  }
}
'''

data = data(fields=["a", "b"], rows=[
    ["A", 28], ["B", 55], ["C", 43],
    ["D", 91], ["E", 81], ["F", 53],
    ["G", 19], ["H", 87], ["I", 52]
])

q.page['external'] = ui.vega_card(
    box='1 1 2 4',
    title='Plot with external data',
    specification=spec,
    data=data,
)
```
