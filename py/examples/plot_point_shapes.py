# Plot / Point / Shapes
# Make a scatterplot with categories encoded as mark shapes.
# #plot
# ---
from h2o_wave import site, data, ui

page = site['/demo']

ice_cream_sales = [('BR1', 14, 225), ('BR1', 16.2, 335), ('BR1', 11.6, 195), ('BR1', 15, 342), ('BR1', 18.3, 416),
                   ('BR1', 21.9, 535), ('BR1', 19.2, 423), ('BR1', 24.9, 624), ('BR1', 23.2, 554), ('BR1', 17.9, 432),
                   ('BR1', 22.4, 455), ('BR1', 17, 420), ('BR2', 14, 205), ('BR2', 16.2, 315), ('BR2', 11.6, 175),
                   ('BR2', 15, 352), ('BR2', 18.3, 376), ('BR2', 21.9, 515), ('BR2', 19.2, 403), ('BR2', 24.9, 604),
                   ('BR2', 23.2, 534), ('BR2', 17.9, 412), ('BR2', 22.4, 435), ('BR2', 17, 400), ]

v = page.add('example', ui.plot_card(
    box='1 1 4 5',
    title='Point, shapes - Temperature vs Ice Cream Sales for different brands',
    data=data('brand temperature sales', len(ice_cream_sales)),
    plot=ui.plot([ui.mark(type='point', x='=temperature', y='=sales', shape='=brand', shape_range='circle square')])
))
v.data = [br for br in ice_cream_sales if br[0].startswith('BR1')] + [br for br in ice_cream_sales if
                                                                      br[0].startswith('BR2')]

page.save()
