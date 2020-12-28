# Plot / Point / Map
# Make a #plot to compare quantities across categories. Similar to a heatmap,
# but using size-encoding instead of color-encoding.
# #map
# ---
from synth import FakeSeries
from h2o_wave import site, data, ui

page = site['/demo']

k1, k2 = 20, 10
f = FakeSeries()
v = page.add('example', ui.plot_card(
    box='1 1 4 5',
    title='Points, size-encoded',
    data=data('country product profit', k1 * k2),
    plot=ui.plot([ui.mark(type='point', x='=country', y='=product', size='=profit', shape='circle')])
))
rows = []
for i in range(k1):
    for j in range(k2):
        x, dx = f.next()
        rows.append((f'A{i + 1}', f'B{j + 1}', x))
v.data = rows

page.save()
