# Plot / Point / Sizes
# No description available.
# ---
import random

from synth import FakeScatter
from telesync import Site, data, ui

site = Site()

page = site['/demo']

n = 40
f = FakeScatter()
v = page.add('example', ui.plot_card(
    box='1 1 4 5',
    title='Point, sized',
    data=data('price performance discount', n),
    vis=ui.vis([ui.mark(mark='point', x='=price', y='=performance', size='=discount')])
))
v.data = [(x, y, random.randint(1, 10)) for x, y in [f.next() for _ in range(n)]]

page.sync()
