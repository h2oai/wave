# Plot / Polygon
# Make a heatmap. #plot
# ---
from h2o_wave import site, data, ui

page = site['/demo']

fruit_popularity = [('AZ', 'Apple', 55), ('AZ', 'Orange', 80), ('AZ', 'Banana', 45),
                    ('CA', 'Apple', 65), ('CA', 'Orange', 95), ('CA', 'Banana', 55),
                    ('FL', 'Apple', 45), ('FL', 'Orange', 50), ('FL', 'Banana', 55),
                    ('NY', 'Apple', 70), ('NY', 'Orange', 110), ('NY', 'Banana', 80),
                    ('TX', 'Apple', 50), ('TX', 'Orange', 90), ('TX', 'Banana', 85), ]

v = page.add('example', ui.plot_card(
    box='1 1 4 5',
    title='Intervals, groups - Fruit popularity in different states',
    data=data(fields=['state', 'fruit', 'popularity'], rows=fruit_popularity),
    plot=ui.plot([ui.mark(type='polygon', x='=state', y='=fruit', color='=popularity',
                          color_range='#fee8c8 #fdbb84 #e34a33', x_title='State', y_title='Fruit')])))

page.save()
