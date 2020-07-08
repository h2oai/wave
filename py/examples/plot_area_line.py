# Plot / Area + Line
# No description available.
# ---
from synth import FakeTimeSeries
from telesync import site, data, ui

page = site['/demo']

n = 50
f = FakeTimeSeries()
v = page.add('example', ui.plot_card(
    box='1 1 4 5',
    title='Area + Line',
    data=data('date price', n),
    plot=ui.plot([
        ui.mark(mark='area', x_scale='time', x='=date', y='=price', y_min=0),
        ui.mark(mark='line', x='=date', y='=price')
    ])
))
v.data = [(t, x) for t, x, dx in [f.next() for _ in range(n)]]

page.sync()
