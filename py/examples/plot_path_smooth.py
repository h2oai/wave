# Plot / Path / Smooth
# Make a path #plot with a smooth curve.
# ---
from h2o_wave import site, data, ui

page = site['/demo']

ice_cream_sales = [(14, 225), (16.2, 335), (11.6, 205), (15, 362), (18.3, 426),
                   (21.9, 540), (19.2, 425), (24.9, 644), (23.2, 564), (17.9, 452),
                   (22.4, 465), (17, 430), (14.3, 285), (18.2, 442), (12, 218),
                   (23.4, 492), (18, 457), (15.3, 315), (19.2, 472), (13, 238)]

v = page.add('example', ui.plot_card(
    box='1 1 4 5',
    title='Path - Temperature vs Ice Cream Sales',
    data=data('temperature sales', len(ice_cream_sales)),
    plot=ui.plot([ui.mark(type='path', x='=temperature', y='=sales', curve='smooth')])))
v.data = ice_cream_sales

page.save()
