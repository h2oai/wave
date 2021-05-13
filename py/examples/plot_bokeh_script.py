# Plot / Bokeh / Script
# Embed Bokeh components into a page using Javascript.
# ---

import json
from h2o_wave import site, ui
from bokeh.resources import CDN
from bokeh.plotting import figure
from bokeh.embed import json_item
from bokeh.sampledata.iris import flowers

# Make a plot
plot = figure(title="Iris Morphology")
plot.xaxis.axis_label = 'Petal Length'
plot.yaxis.axis_label = 'Petal Width'

colormap = {'setosa': 'red', 'versicolor': 'green', 'virginica': 'blue'}
colors = [colormap[x] for x in flowers['species']]
plot.circle(flowers["petal_length"], flowers["petal_width"], color=colors, fill_alpha=0.2, size=10)

# Serialize the plot as JSON.
# See https://docs.bokeh.org/en/latest/docs/user_guide/embed.html#json-items
plot_id = 'my_plot'
plot_data = json.dumps(json_item(plot, plot_id))

page = site['/demo']

page['meta'] = ui.meta_card(
    box='',
    # Import Bokeh Javascript libraries from CDN
    scripts=[ui.script(path=f) for f in CDN.js_files],
    # Execute custom Javascript
    script=ui.inline_script(
        # Call Bakeh's renderer using Javascript
        content=f'Bokeh.embed.embed_item({plot_data});',
        # Ensure that the Bokeh Javascript library is available
        requires=['Bokeh'],
        # Ensure that the target HTML container element is available
        targets=[plot_id],
    ),
)

# Create a HTML container element to hold our plot.
page['example'] = ui.markup_card(
    box='1 1 5 8',
    title='',
    content=f'<div id="{plot_id}"></div>',
)

page.save()
