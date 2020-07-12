# Plot / Point
# Make a scatterplot.
# ---
from synth import FakeScatter
from telesync import site, data, ui

page = site['/demo']

n = 50
f = FakeScatter()
v = page.add('example', ui.plot_card(
    box='1 1 4 5',
    title='Point',
    data=data('price performance', n),
    plot=ui.plot([
        ui.mark(type='point', x='=price', y='=performance')
    ])
))
v.data = [f.next() for i in range(n)]

page.sync()
