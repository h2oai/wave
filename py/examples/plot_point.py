# Plot / Point
# No description available.
# ---
from synth import FakeScatter
from telesync import Site, data, ui

site = Site()

page = site['/demo']

n = 50
f = FakeScatter()
v = page.add('example', ui.plot_card(
    box='1 1 4 5',
    title='Point',
    data=data('price performance', n),
    vis=ui.vis([
        ui.mark(mark='point', x='=price', y='=performance')
    ])
))
v.data = [f.next() for i in range(n)]

page.sync()
