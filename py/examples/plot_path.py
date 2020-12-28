# Plot / Path
# Make a path #plot.
# ---
from synth import FakeScatter
from h2o_wave import site, data, ui

page = site['/demo']

n = 50
f = FakeScatter()
v = page.add('example', ui.plot_card(
    box='1 1 4 5',
    title='Path',
    data=data('profit sales', n),
    plot=ui.plot([ui.mark(type='path', x='=profit', y='=sales')])
))
v.data = [(x, y) for x, y in [f.next() for _ in range(n)]]

page.save()
