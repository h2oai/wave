# Plot / Area + Line / Groups
# No description available.
# ---
from synth import FakeMultiTimeSeries
from telesync import Site, data, ui

site = Site()

page = site['/demo']

n = 50
f = FakeMultiTimeSeries()
v = page.add('example', ui.plot_card(
    box='1 1 4 5',
    title='Area + Line, groups',
    data=data('product date price', n * 5),
    vis=ui.vis([
        ui.mark(mark='area', x_scale='time', x='=date', y='=price', color='=product', y_min=0),
        ui.mark(mark='line', x='=date', y='=price', color='=product')
    ])
))

v.data = [(g, t, x) for x in [f.next() for _ in range(n)] for g, t, x, dx in x]

page.sync()
