# Plot / Wide
# Create a wide plot card displaying a plot with title and caption.
# ---
from h2o_wave import site, ui, data
from synth import FakeCategoricalSeries

page = site['/demo']

f = FakeCategoricalSeries()
n = 10
v = page.add('example', ui.wide_plot_card(
    box='1 1 5 4',
    title='Wide Plot Card',
    caption='''
    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quia aliquam maxime quos facere
    necessitatibus tempore eum odio, qui illum. Repellat modi dolor facilis odio ex possimus
    ''',
    data=data('product price', n),
    plot=ui.plot([ui.mark(type='interval', x='=product', y='=price', y_min=0)])
))
v.data = [(c, x) for c, x, dx in [f.next() for _ in range(n)]]

page.save()
