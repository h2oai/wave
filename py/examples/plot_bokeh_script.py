# Plot / Bokeh / Script
# Embed Bokeh components into a page using Javascript.
# ---

import json
from h2o_wave import site, ui
from bokeh.resources import CDN
from bokeh.plotting import figure
from bokeh.embed import json_item

plot = figure()
plot.circle([1, 2], [3, 4])

plot_data = json.dumps(json_item(plot, "my_plot"))

page = site['/demo']
page['meta'] = ui.meta_card(
    box='',
    scripts=[ui.script(path=f) for f in CDN.js_files],
    script=ui.inline_script(
        content=f'Bokeh.embed.embed_item({plot_data});',
        requires=['Bokeh'],
        targets=['my_plot']
    ),
)
page['example'] = ui.markup_card(box='1 1 5 5', title='', content='<div id="my_plot"></div>')
page.save()
