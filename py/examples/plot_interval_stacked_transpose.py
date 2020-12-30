# Plot / Interval / Stacked / Transpose
# Make a stacked bar plot.
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
    title='Intervals, stacked - Fruit popularity in different states',
    data=data('state fruit popularity', len(fruit_popularity)),
    plot=ui.plot([ui.mark(type='interval', x='=popularity', y='=state', color='=fruit', stack='auto', y_min=0)])
))

v.data = fruit_popularity

page.save()
