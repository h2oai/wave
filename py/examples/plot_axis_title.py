# Plot / Axis Titles
# Display custom axis titles on a plot.
# ---
from h2o_wave import site, data, ui

page = site['/demo']

ice_cream_sales = [('2020-01-01', 650), ('2020-01-02', 600), ('2020-01-03', 450), ('2020-01-04', 530),
                   ('2020-01-05', 490), ('2020-01-06', 540), ('2020-01-07', 550), ('2020-01-08', 580),
                   ('2020-01-09', 570), ('2020-01-10', 610), ('2020-01-11', 630), ('2020-01-12', 680),
                   ('2020-01-13', 720), ('2020-01-14', 690), ('2020-01-15', 630), ('2020-01-16', 610)
                   ]

v = page.add('example', ui.plot_card(
    box='1 1 4 5',
    title='Line - Ice Cream Sales',
    data=data('date sales', len(ice_cream_sales)),
    plot=ui.plot(
        [ui.mark(type='line', x_scale='time', x='=date', y='=sales', y_min=300, x_title='Date',
                 y_title='Total Sales')])))
v.data = ice_cream_sales

page.save()
