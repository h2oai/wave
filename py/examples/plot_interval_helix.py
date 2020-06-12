# Plot / Interval / Helix
# No description available.
# ---
from synth import FakeCategoricalSeries
from telesync import Site, data, ui

site = Site()

page = site['/demo']

n = 200
f = FakeCategoricalSeries()
v = page.add('example', ui.plot_card(
    box='1 1 4 5',
    title='Interval, helix',
    data=data('product price', n),
    vis=ui.vis([ui.mark(coord='helix', mark='interval', x='=product', y='=price', y_min=0)])
))
v.data = [(c, x) for c, x, dx in [f.next() for _ in range(n)]]

page.sync()
