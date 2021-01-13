# Plot / Area / Stacked
# Make a #stacked area #plot.
# ---
from synth import FakeMultiTimeSeries
from h2o_wave import site, data, ui

page = site['/demo']

n = 50
f = FakeMultiTimeSeries()
v = page.add('example', ui.plot_card(
    box='1 1 4 5',
    title='Area, stacked',
    data=data('product date price', n * 5),
    plot=ui.plot(
        [ui.mark(type='area', x_scale='time', x='=date', y='=price', color='=product', stack='auto', y_min=0)])
))

v.data = [(g, t, x) for x in [f.next() for _ in range(n)] for g, t, x, dx in x]

page.save()
