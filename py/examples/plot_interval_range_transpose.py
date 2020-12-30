# Plot / Interval / Range / Transpose
# Make a bar plot with each bar representing high/low (or start/end) values. Transposing this produces a gantt plot.
# ---

from h2o_wave import site, data, ui

page = site['/demo']

fruit_price = [('Apple', 55, 75), ('Orange', 70, 95), ('Banana', 45, 65), ('Kiwifruit', 40, 70),
               ('Blueberry', 70, 95), ('Grapes', 55, 80), ('Pears', 65, 90), ('Watermelon', 35, 65), ]

v = page.add('example', ui.plot_card(
    box='1 1 4 5',
    title='Interval, range - Fruit popularity',
    data=data('fruit low high', len(fruit_price)),
    plot=ui.plot([ui.mark(type='interval', x0='=low', x='=high', y='=fruit')])
))
v.data = fruit_price

page.save()
