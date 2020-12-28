# Plot / Interval / Stacked / Grouped
# Make a column #plot with both #stacked and grouped bars. #interval
# ---
from synth import FakeMultiCategoricalSeries
from h2o_wave import site, data, ui

page = site['/demo']

n = 5
k = 5
f1 = FakeMultiCategoricalSeries(groups=k)
f2 = FakeMultiCategoricalSeries(groups=k)
v = page.add('example', ui.plot_card(
    box='1 1 4 5',
    title='Intervals, stacked and dodged',
    data=data('category country product price', n * k * 2),
    plot=ui.plot([
        ui.mark(type='interval', x='=product', y='=price', color='=country', stack='auto', dodge='=category', y_min=0)])
))

data1 = [('A', g, t, x) for x in [f1.next() for _ in range(n)] for g, t, x, _ in x]
data2 = [('B', g, t, x) for x in [f2.next() for _ in range(n)] for g, t, x, _ in x]
v.data = data1 + data2

page.save()
