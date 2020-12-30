# Plot / Interval / Stacked / Grouped / Transpose
# Make a bar plot with both stacked and grouped bars.
# ---
from h2o_wave import site, data, ui

page = site['/demo']

fruit_popularity = [('January', 'AZ', 'Apple', 55), ('January', 'AZ', 'Orange', 80), ('January', 'AZ', 'Banana', 45),
                    ('February', 'AZ', 'Apple', 60), ('February', 'AZ', 'Orange', 85), ('February', 'AZ', 'Banana', 50),
                    ('January', 'CA', 'Apple', 65), ('January', 'CA', 'Orange', 95), ('January', 'CA', 'Banana', 55),
                    ('February', 'CA', 'Apple', 75), ('February', 'CA', 'Orange', 110), ('February', 'CA', 'Banana', 70),
                    ('January', 'FL', 'Apple', 45), ('January', 'FL', 'Orange', 50), ('January', 'FL', 'Banana', 55),
                    ('February', 'FL', 'Apple', 40), ('February', 'FL', 'Orange', 65), ('February', 'FL', 'Banana', 70), ]

v = page.add('example', ui.plot_card(
    box='1 1 4 5',
    title='Intervals, stacked and dodged - Fruit popularity in different states',
    data=data('month state fruit popularity', len(fruit_popularity)),
    plot=ui.plot(
        [ui.mark(type='interval', x='=popularity', y='=state', color='=fruit', dodge='=month', stack='auto', y_min=0)])
))

v.data = fruit_popularity

page.save()
