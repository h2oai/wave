# Plot / Vega-lite / Update
# Periodically update a Vega-lite #plot. #vega
# ---
from h2o_wave import site, data, ui
import random
import time

page = site['/demo']

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


# Generate random datum between 1 and 100
def rnd():
    return random.randint(1, 100)


# Get data rows for our plot.
# Typically, this data would be read from some external data source.
def poll():
    return [
        ["A", rnd()], ["B", rnd()], ["C", rnd()],
        ["D", rnd()], ["E", rnd()], ["F", rnd()],
        ["G", rnd()], ["H", rnd()], ["I", rnd()]
    ]


vis = page.add('external', ui.vega_card(
    box='1 1 2 4',
    title='Plot with external data',
    specification=spec,
    data=data(fields=["a", "b"], rows=poll()),
))

page.save()

while True:
    time.sleep(1)
    # Update the plot's data rows
    vis.data = poll()
    page.save()
