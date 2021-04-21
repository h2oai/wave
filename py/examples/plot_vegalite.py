# Plot / Vega-lite
# Make a #plot using Vega-lite. #vega
# ---
from h2o_wave import site, data, ui

page = site['/demo']

spec1 = '''
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

page.add('embedded', ui.vega_card(
    box='1 1 2 4',
    title='Plot with embedded data',
    specification=spec1,
))

# The following produces the same plot as above, but separates the
# Vega-lite spec from the data. This allows you to create a plot once
# and update data multiple times.
spec2 = '''
{
  "description": "A simple bar plot with embedded data.",
  "mark": "bar",
  "encoding": {
    "x": {"field": "a", "type": "ordinal"},
    "y": {"field": "b", "type": "quantitative"}
  }
}
'''

data2 = data(fields=["a", "b"], rows=[
    ["A", 28], ["B", 55], ["C", 43],
    ["D", 91], ["E", 81], ["F", 53],
    ["G", 19], ["H", 87], ["I", 52]
])

page.add('external', ui.vega_card(
    box='1 5 2 4',
    title='Plot with external data',
    specification=spec2,
    data=data2,
))

page.save()
