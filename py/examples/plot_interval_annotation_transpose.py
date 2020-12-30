# Plot / Interval / Annotation / Transpose
# Add annotations to a bar plot.
# ---
from h2o_wave import site, data, ui

page = site['/demo']

fruit_popularity = [('Apple', 55), ('Orange', 80), ('Banana', 45), ('Kiwifruit', 40),
                    ('Blueberry', 85), ('Grapes', 60), ('Pears', 65), ('Watermelon', 35), ]

v = page.add('example', ui.plot_card(
    box='1 1 4 5',
    title='Categorical-Numeric - Fruit popularity',
    data=data('fruit popularity', len(fruit_popularity)),
    plot=ui.plot([
        ui.mark(type='interval', x='=popularity', y='=fruit', x_min=30, x_max=100),
        ui.mark(y='Blueberry', x=90, label='point'),
        ui.mark(y='Kiwifruit', label='vertical line'),
        ui.mark(x=60, label='horizontal line'),
        ui.mark(y='Banana', y0='Apple', label='vertical region'),
        ui.mark(x=70, x0=50, label='horizontal region')
    ])
))
v.data = fruit_popularity

page.save()
