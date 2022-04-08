# Plot / Interval / Helix
# Make a bar #plot in helical coordinates. #interval
# ---
from h2o_wave import site, data, ui

page = site['/demo']

page.add('example', ui.plot_card(
    box='1 1 4 5',
    title='Interval, helix',
    data=data('product price', 200, rows=[ (f'P{i}', i) for i in range(200)]),
    plot=ui.plot([ui.mark(coord='helix', type='interval', x='=product', y='=price', y_min=0)])
))

page.save()
