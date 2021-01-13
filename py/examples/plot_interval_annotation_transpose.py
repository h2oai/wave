# Plot / Interval / Annotation / Transpose
# Add annotations to a bar #plot. #annotation #interval
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
        ui.mark(type='interval', y='=product', x='=price', x_min=0, x_max=100),
        ui.mark(y='C10', x=80, label='point'),
        ui.mark(y='C13', label='vertical line'),
        ui.mark(x=40, label='horizontal line'),
        ui.mark(y='C6', y0='C3', label='vertical region'),
        ui.mark(x=70, x0=60, label='horizontal region')
    ])
))
v.data = [(c, x) for c, x, dx in [f.next() for _ in range(n)]]

page.save()
