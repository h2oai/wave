# Plot / Interval / Annotation
# Add annotations to a column #plot. #annotation #interval
# ---
from synth import FakeCategoricalSeries
from h2o_wave import site, data, ui

page = site['/demo']

n = 20
f = FakeCategoricalSeries()
v = page.add('example', ui.plot_card(
    box='1 1 4 5',
    title='Categorical-Numeric',
    data=data('product price', n),
    plot=ui.plot([
        ui.mark(type='interval', x='=product', y='=price', y_min=0, y_max=100),
        ui.mark(x='C10', y=80, label='point'),
        ui.mark(x='C13', label='vertical line'),
        ui.mark(y=40, label='horizontal line'),
        ui.mark(x='C6', x0='C3', label='vertical region'),
        ui.mark(y=70, y0=60, label='horizontal region')
    ])
))
v.data = [(c, x) for c, x, dx in [f.next() for _ in range(n)]]

page.save()
