# Plot / Area / Negative
# Make an area plot showing positive and negative values.
# ---
from h2o_wave import site, data, ui

page = site['/demo']

ice_cream_sales = [('2020-01-01', -10), ('2020-01-02', -15), ('2020-01-03', -30), ('2020-01-04', -25),
                   ('2020-01-05', -12), ('2020-01-06', -5), ('2020-01-07', -8), ('2020-01-08', -4),
                   ('2020-01-09', -3), ('2020-01-10', -5), ('2020-01-11', -2), ('2020-01-12', 0),
                   ('2020-01-13', 2), ('2020-01-14', 4), ('2020-01-15', 5), ('2020-01-16', 10)
                   ]

v = page.add('example', ui.plot_card(
    box='1 1 4 5',
    title='Area negative values - Temperature',
    data=data('date temperature', len(ice_cream_sales)),
    plot=ui.plot([ui.mark(type='area', x_scale='time', x='=date', y='=temperature', y_min=300)])
))
v.data = ice_cream_sales

page.save()
