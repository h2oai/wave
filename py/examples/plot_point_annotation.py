# Plot / Point / Annotation
# No description available.
# ---
from synth import FakeScatter
from telesync import site, data, ui

page = site['/demo']

n = 50
f = FakeScatter()
v = page.add('example', ui.plot_card(
    box='1 1 4 5',
    title='Numeric-Numeric',
    data=data('price performance', n),
    vis=ui.vis([
        ui.mark(mark='point', x='=price', y='=performance', x_min=0, x_max=100, y_min=0, y_max=100),
        ui.mark(x=50, y=50, label='point'),
        ui.mark(x=40, label='vertical line'),
        ui.mark(y=40, label='horizontal line'),
        ui.mark(x=70, x0=60, label='vertical region'),
        ui.mark(y=70, y0=60, label='horizontal region'),
        ui.mark(x=30, x0=20, y=30, y0=20, label='rectangular region')
    ])
))
v.data = [f.next() for _ in range(n)]

page.sync()
