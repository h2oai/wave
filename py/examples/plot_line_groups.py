# Plot / Line / Groups
# Make a multi-series line #plot. #multi_series
# ---
from h2o_wave import site, data, ui

page = site['/demo']

ice_cream_sales = [('2020-01-01', 'BR1', 650), ('2020-01-02', 'BR1', 600), ('2020-01-03', 'BR1', 450),
                   ('2020-01-04', 'BR1', 530), ('2020-01-05', 'BR1', 490), ('2020-01-06', 'BR1', 540),
                   ('2020-01-07', 'BR1', 550), ('2020-01-01', 'BR2', 580), ('2020-01-02', 'BR2', 570),
                   ('2020-01-03', 'BR2', 610), ('2020-01-04', 'BR2', 630), ('2020-01-05', 'BR2', 680),
                   ('2020-01-06', 'BR2', 720), ('2020-01-07', 'BR2', 690), ('2020-01-01', 'BR3', 630),
                   ('2020-01-02', 'BR3', 610), ('2020-01-03', 'BR3', 720), ('2020-01-04', 'BR3', 690),
                   ('2020-01-05', 'BR3', 630), ('2020-01-06', 'BR3', 610), ('2020-01-07', 'BR3', 610),
                   ]

v = page.add('example', ui.plot_card(
    box='1 1 4 5',
    title='Line, groups - Ice Cream Sales different brands',
    data=data('date brand sales', len(ice_cream_sales)),
    plot=ui.plot([ui.mark(type='line', x_scale='time', x='=date', y='=sales', color='=brand', y_min=300)])
))

v.data = ice_cream_sales

page.save()
