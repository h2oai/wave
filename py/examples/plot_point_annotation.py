# Plot / Point / Annotation
# Add annotations (points, lines and regions) to a plot.
# ---
from h2o_wave import site, data, ui

page = site['/demo']

ice_cream_sales = [(14, 225), (16.2, 335), (11.6, 205), (15, 362), (18.3, 426),
                   (21.9, 540), (19.2, 425), (24.9, 644), (23.2, 564), (17.9, 452),
                   (22.4, 465), (17, 430), (14.3, 285), (18.2, 442), (12, 218),
                   (23.4, 492), (18, 457), (15.3, 315), (19.2, 472), (13, 238)]

v = page.add('example', ui.plot_card(
    box='1 1 4 5',
    title='Temperature vs Ice Cream Sales',
    data=data('temperature sales', len(ice_cream_sales)),
    plot=ui.plot([
        ui.mark(type='point', x='=temperature', y='=sales', x_min=10, x_max=30, y_min=150, y_max=700),  # the plot
        ui.mark(x=22, y=500, label='point'),  # A single reference point
        ui.mark(x=21, label='vertical line'),
        ui.mark(y=450, label='horizontal line'),
        ui.mark(x=18, x0=20, label='vertical region'),
        ui.mark(y=520, y0=600, label='horizontal region'),
        ui.mark(x=11, x0=15, y=220, y0=300, label='rectangular region')
    ])
))
v.data = v.data = ice_cream_sales

page.save()
