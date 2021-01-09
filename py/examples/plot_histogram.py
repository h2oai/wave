# Plot / Histogram
# Make a #histogram. #plot
# ---
from h2o_wave import site, data, ui

page = site['/demo']

orange_price = [(4, 50, 100), (6, 100, 150), (8, 150, 200), (10, 200, 250),
                (12, 250, 300), (14, 300, 350), (16, 350, 400), (18, 400, 450)
                ]

v = page.add('example', ui.plot_card(
    box='1 1 4 5',
    title='Histogram',
    data=data('price low high', len(orange_price)),
    plot=ui.plot([ui.mark(type='interval', y='=price', x1='=low', x2='=high', y_min=0)])
))
v.data = orange_price

page.save()
