# Plot / Path / Point
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
    title='Path + Point',
    data=data('profit sales', n),
    vis=ui.vis([
        ui.mark(mark='path', x='=profit', y='=sales'),
        ui.mark(mark='point', x='=profit', y='=sales'),
    ])
))
v.data = [(x, y) for x, y in [f.next() for _ in range(n)]]

page.sync()
