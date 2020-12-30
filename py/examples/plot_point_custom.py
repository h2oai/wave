# Plot / Point / Custom
# Customize a plot's fill/stroke color, size and opacity.
# #plot
# ---
from h2o_wave import site, data, ui

page = site['/demo']

ice_cream_sales = [(3, 14, 225), (5, 16.2, 335), (6, 11.6, 205), (10, 15, 362), (5, 18.3, 426),
                   (3, 21.9, 540), (3, 19.2, 425), (5, 24.9, 644), (4, 23.2, 564), (10, 17.9, 452),
                   (5, 22.4, 465), (7, 17, 430), (5, 14.3, 285), (10, 18.2, 442), (3, 12, 218),
                   (5, 23.4, 492), (7, 18, 457), (5, 15.3, 315), (5, 19.2, 472), (5, 13, 238)]

v = page.add('example', ui.plot_card(
    box='1 1 4 5',
    title='Point, custom - Temperature vs Ice Cream Sales',
    data=data('discount temperature sales', len(ice_cream_sales)),
    plot=ui.plot([ui.mark(type='point', x='=temperature', y='=sales', size='=discount', size_range='3 10',
                          fill_color='#eb4559', stroke_color='#eb4559', stroke_size=1, fill_opacity=0.3,
                          stroke_opacity=1)])
))
v.data = ice_cream_sales

page.save()
