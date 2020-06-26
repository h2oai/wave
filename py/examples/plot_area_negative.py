# Plot / Area / Negative
# No description available.
# ---
from synth import FakeTimeSeries
from telesync import site, data, ui

page = site['/demo']

n = 50
f = FakeTimeSeries(min=-50, max=50, start=0)
v = page.add('example', ui.plot_card(
    box='1 1 4 5',
    title='Area, negative values',
    data=data('date price', n),
    vis=ui.vis([ui.mark(mark='area', x_scale='time', x='=date', y='=price')])
))
v.data = [(t, x) for t, x, dx in [f.next() for _ in range(n)]]

page.sync()
