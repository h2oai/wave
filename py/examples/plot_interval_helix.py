# Plot / Interval / Helix
# Make a bar #plot in helical coordinates. #interval
# ---
from synth import FakeCategoricalSeries
from h2o_wave import site, data, ui

page = site['/demo']

n = 200
f = FakeCategoricalSeries()
v = page.add('example', ui.plot_card(
    box='1 1 4 5',
    title='Interval, helix',
    data=data('product price', n),
    plot=ui.plot([ui.mark(coord='helix', type='interval', x='=product', y='=price', y_min=0)])
))
v.data = [(c, x) for c, x, dx in [f.next() for _ in range(n)]]

page.save()
