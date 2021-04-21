# Plot / Bokeh
# Use #Bokeh to create plots. #plot
# ---
import numpy as np
from bokeh.models import HoverTool
from bokeh.plotting import figure
from bokeh.resources import CDN
from bokeh.embed import file_html

from h2o_wave import site, ui

n = 500
x = 2 + 2 * np.random.standard_normal(n)
y = 2 + 2 * np.random.standard_normal(n)
p = figure(
    match_aspect=True,
    tools="wheel_zoom,reset",
    background_fill_color='#440154',
    sizing_mode='stretch_both'
)
p.grid.visible = False
r, bins = p.hexbin(x, y, size=0.5, hover_color="pink", hover_alpha=0.8)
p.circle(x, y, color="white", size=1)
p.add_tools(HoverTool(
    tooltips=[("count", "@c"), ("(q,r)", "(@q, @r)")],
    mode="mouse",
    point_policy="follow_mouse",
    renderers=[r]
))

# Export html for our frame card
html = file_html(p, CDN, "plot")

page = site['/demo']
page['example'] = ui.frame_card(
    box='1 1 5 8',
    title='Hexbin for 500 points',
    content=html,
)
page.save()
