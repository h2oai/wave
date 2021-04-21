# Plot / Path / Point
# Make a path #plot with an additional layer of points.
# ---
from synth import FakeScatter
from h2o_wave import site, data, ui

page = site['/demo']

n = 50
f = FakeScatter()
v = page.add('example', ui.plot_card(
    box='1 1 4 5',
    title='Path + Point',
    data=data('profit sales', n),
    plot=ui.plot([
        ui.mark(type='path', x='=profit', y='=sales'),
        ui.mark(type='point', x='=profit', y='=sales'),
    ])
))
v.data = [(x, y) for x, y in [f.next() for _ in range(n)]]

page.save()
