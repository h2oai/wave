# Plot / Interval
# Make a bar plot.
# ---
from synth import FakeCategoricalSeries
from telesync import site, data, ui

page = site['/demo']

n = 20
f = FakeCategoricalSeries()
v = page.add('example', ui.plot_card(
    box='1 1 4 5',
    title='Interval',
    data=data('product price', n),
    plot=ui.plot([ui.mark(type='interval', x='=product', y='=price', y_min=0)])
))
v.data = [(c, x) for c, x, dx in [f.next() for _ in range(n)]]

page.save()
