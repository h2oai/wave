# Plot / Interval / Range
# No description available.
# ---
import random

from synth import FakeCategoricalSeries
from telesync import site, data, ui

page = site['/demo']

n = 20
f = FakeCategoricalSeries()
v = page.add('example', ui.plot_card(
    box='1 1 4 5',
    title='Interval, range',
    data=data('product low high', n),
    vis=ui.vis([ui.mark(mark='interval', x='=product', y0='=low', y='=high')])
))
v.data = [(c, x - random.randint(3, 10), x + random.randint(3, 10)) for c, x, dx in [f.next() for _ in range(n)]]

page.sync()
