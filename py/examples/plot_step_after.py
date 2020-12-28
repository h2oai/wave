# Plot / Line / Step / After
# Make a line #plot with a step-after curve.
# ---
from synth import FakeTimeSeries
from h2o_wave import site, data, ui

page = site['/demo']

n = 50
f = FakeTimeSeries()
v = page.add('example', ui.plot_card(
    box='1 1 4 5',
    title='Line, step-right',
    data=data('date price', n),
    plot=ui.plot([ui.mark(type='line', x_scale='time', x='=date', y='=price', curve='step-after', y_min=0)])
))
v.data = [(t, x) for t, x, dx in [f.next() for _ in range(n)]]

page.save()
