# Plot / Point / Shapes
# Make a scatterplot with categories encoded as mark shapes.
# #plot
# ---
from synth import FakeScatter
from h2o_wave import site, data, ui

page = site['/demo']


def create_fake_row(g, f, n):
    return [(g, x, y) for x, y in [f.next() for _ in range(n)]]


n = 30
f1, f2 = FakeScatter(), FakeScatter()
v = page.add('example', ui.plot_card(
    box='1 1 4 5',
    title='Point, shapes',
    data=data('product price performance', n * 2),
    plot=ui.plot([ui.mark(type='point', x='=price', y='=performance', shape='=product', shape_range='circle square')])
))
v.data = create_fake_row('G1', f1, n) + create_fake_row('G2', f1, n)

page.save()
