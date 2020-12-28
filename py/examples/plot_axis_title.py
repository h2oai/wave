# Plot / Axis Titles
# Display custom axis titles on a #plot.
# ---
from synth import FakeTimeSeries
from h2o_wave import site, data, ui

page = site['/demo']

n = 50
f = FakeTimeSeries()
v = page.add('example', ui.plot_card(
    box='1 1 4 5',
    title='Line',
    data=data('date price', n),
    plot=ui.plot(
        [ui.mark(type='line', x_scale='time', x='=date', y='=price', y_min=0, x_title='Date', y_title='Price')])
))
v.data = [(t, x) for t, x, dx in [f.next() for _ in range(n)]]

page.save()
