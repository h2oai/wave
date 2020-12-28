# Plot / Area / Negative
# Make an area #plot showing positive and negative values.
# ---
from synth import FakeTimeSeries
from h2o_wave import site, data, ui

page = site['/demo']

n = 50
f = FakeTimeSeries(min=-50, max=50, start=0)
v = page.add('example', ui.plot_card(
    box='1 1 4 5',
    title='Area, negative values',
    data=data('date price', n),
    plot=ui.plot([ui.mark(type='area', x_scale='time', x='=date', y='=price')])
))
v.data = [(t, x) for t, x, dx in [f.next() for _ in range(n)]]

page.save()
