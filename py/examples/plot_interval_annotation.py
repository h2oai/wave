# Plot / Interval / Annotation
# Add annotations to a column #plot. #annotation #interval
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
        ui.mark(type='interval', x='=fruit', y='=popularity', y_min=30, y_max=100),
        ui.mark(x='Blueberry', y=90, label='point'),
        ui.mark(x='Kiwifruit', label='vertical line'),
        ui.mark(y=60, label='horizontal line'),
        ui.mark(x='Banana', x0='Apple', label='vertical region'),
        ui.mark(y=70, y0=50, label='horizontal region')
    ])
))
v.data = fruit_popularity

page.save()
