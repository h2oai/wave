# Plot / Line / Annotation
# Add annotations to a line #plot. #annotation
# ---
from synth import FakeTimeSeries
from h2o_wave import site, data, ui

page = site['/demo']

n = 50
f = FakeTimeSeries()
v = page.add('example', ui.plot_card(
    box='1 1 4 5',
    title='Time-Numeric',
    data=data('date price', n),
    plot=ui.plot([
        ui.mark(type='line', x_scale='time', x='=date', y='=price', y_min=0, y_max=100),
        ui.mark(x=50, y=50, label='point'),
        ui.mark(x='2010-05-15T19:59:21.000000Z', label='vertical line'),
        ui.mark(y=40, label='horizontal line'),
        ui.mark(x='2010-05-24T19:59:21.000000Z', x0='2010-05-20T19:59:21.000000Z', label='vertical region'),
        ui.mark(y=70, y0=60, label='horizontal region'),
        ui.mark(x='2010-05-10T19:59:21.000000Z', x0='2010-05-05T19:59:21.000000Z', y=30, y0=20,
                label='rectangular region')
    ])
))
v.data = [(t, x) for t, x, dx in [f.next() for _ in range(n)]]

page.save()
