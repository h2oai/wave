# Plot / Area / Range
# Make an area #plot representing a range (band) of values.
# ---
import random

from synth import FakeTimeSeries
from h2o_wave import site, data, ui

page = site['/demo']

n = 50
f = FakeTimeSeries()
v = page.add('example', ui.plot_card(
    box='1 1 4 5',
    title='Area, range',
    data=data('date low high', n),
    plot=ui.plot([ui.mark(type='area', x_scale='time', x='=date', y0='=low', y='=high')])
))
v.data = [(t, x - random.randint(3, 8), x + random.randint(3, 8)) for t, x, dx in [f.next() for _ in range(n)]]

page.save()
