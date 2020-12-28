# Plot / Interval / Groups
# Make a grouped column #plot. #interval
# ---
from synth import FakeMultiCategoricalSeries
from h2o_wave import site, data, ui

page = site['/demo']

n = 10
k = 3
f = FakeMultiCategoricalSeries(groups=k)
v = page.add('example', ui.plot_card(
    box='1 1 4 5',
    title='Intervals, groups',
    data=data('country product price', n * k),
    plot=ui.plot([ui.mark(type='interval', x='=product', y='=price', color='=country', dodge='auto', y_min=0)])
))

v.data = [(g, t, x) for x in [f.next() for _ in range(n)] for g, t, x, dx in x]

page.save()
