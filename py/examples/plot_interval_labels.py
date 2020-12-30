# Plot / Interval / Labels
# Make a column #plot with labels on each bar. #interval
# ---
from h2o_wave import site, data, ui

page = site['/demo']

fruit_popularity = [('Apple', 55), ('Orange', 80), ('Banana', 45), ('Kiwifruit', 40),
                    ('Blueberry', 85), ('Grapes', 60), ('Pears', 65), ('Watermelon', 35), ]

v = page.add('example', ui.plot_card(
    box='1 1 4 5',
    title='Label Customization - Fruit popularity',
    data=data('fruit popularity', len(fruit_popularity)),
    plot=ui.plot([ui.mark(type='interval', x='=fruit', y='=popularity', color='#333333',
                          label='={{intl popularity}}',
                          label_offset=0, label_position='middle', label_rotation='-90', label_fill_color='#fff',
                          label_font_weight='bold'
                          )])
))
v.data = fruit_popularity

page.save()
