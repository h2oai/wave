# Plot / Vega-lite / Form
# Display a Vega-lite #plot inside a #form card. #vega
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


# Get data rows for our plot.
# Typically, this data would be read from some external data source.
def poll():
    return [
        ["A", rnd()], ["B", rnd()], ["C", rnd()],
        ["D", rnd()], ["E", rnd()], ["F", rnd()],
        ["G", rnd()], ["H", rnd()], ["I", rnd()]
    ]


# Generate random datum between 1 and 100
def rnd():
    return random.randint(1, 100)


page['example'] = ui.form_card(
    box='1 1 2 -1',
    items=[
        ui.text_xl('Example 1'),
        ui.vega_visualization(
            specification=spec,
            data=data(fields=["a", "b"], rows=poll(), pack=True),
        ),
        ui.text_xl('Example 2'),
        ui.vega_visualization(
            specification=spec,
            data=data(fields=["a", "b"], rows=poll(), pack=True),
        ),
        ui.text_xl('Example 3'),
        ui.vega_visualization(
            specification=spec,
            data=data(fields=["a", "b"], rows=poll(), pack=True),
        ),
    ],
)

page.save()
