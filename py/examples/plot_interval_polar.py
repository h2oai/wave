# Plot / Interval / Polar
# Make a rose #plot (a bar plot in polar coordinates). #interval
# ---
from synth import FakeCategoricalSeries
from h2o_wave import site, data, ui

page = site['/demo']

n = 24
f = FakeCategoricalSeries()
v = page.add('example', ui.plot_card(
    box='1 1 4 5',
    title='Interval, polar',
    data=data('product price', n),
    plot=ui.plot([ui.mark(coord='polar', type='interval', x='=product', y='=price', y_min=0)])
))
v.data = [(c, x) for c, x, dx in [f.next() for _ in range(n)]]

page.save()
