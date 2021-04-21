# Plot / Line / Labels / Occlusion
# Make a line #plot with non-overlapping labels.
# ---
from synth import FakeTimeSeries
from h2o_wave import site, data, ui

page = site['/demo']

n = 50
f = FakeTimeSeries()
v = page.add('example', ui.plot_card(
    box='1 1 4 5',
    title='Remove overlapping labels',
    data=data('date price', n),
    plot=ui.plot([ui.mark(type='line', x_scale='time', x='=date', y='=price', y_min=0,
                          label='=${{intl price minimum_fraction_digits=2 maximum_fraction_digits=2}}',
                          label_overlap='hide')])
))
v.data = [(t, x) for t, x, dx in [f.next() for _ in range(n)]]

page.save()
