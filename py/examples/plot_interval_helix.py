# Plot / Interval / Helix
# Make a bar plot in helical coordinates.
# ---
from h2o_wave import site, data, ui

page = site['/demo']

fruit_popularity = [('Apple', 55), ('Orange', 80), ('Banana', 45), ('Kiwifruit', 40),
                    ('Blueberry', 85), ('Grapes', 60), ('Pears', 65), ('Watermelon', 35), ]

v = page.add('example', ui.plot_card(
    box='1 1 4 5',
    title='Interval, helix - Fruit popularity',
    data=data('fruit popularity', len(fruit_popularity)),
    plot=ui.plot([ui.mark(coord='helix', type='interval', x='=fruit', y='=popularity')])
))
v.data = fruit_popularity

page.save()
