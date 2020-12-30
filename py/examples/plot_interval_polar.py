# Plot / Interval / Polar
# Make a rose plot (a bar plot in polar coordinates).
# ---
from h2o_wave import site, data, ui

page = site['/demo']

fruit_popularity = [('Apple', 55), ('Orange', 80), ('Banana', 45), ('Kiwifruit', 40),
                    ('Blueberry', 85), ('Grapes', 60), ('Pears', 65), ('Watermelon', 35), ]

v = page.add('example', ui.plot_card(
    box='1 1 4 5',
    title='Interval, polar - Fruit popularity',
    data=data('fruit popularity', len(fruit_popularity)),
    plot=ui.plot([ui.mark(coord='polar', type='interval', x='=fruit', y='=popularity')])
))
v.data = fruit_popularity

page.save()
