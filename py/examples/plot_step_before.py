# Plot / Line / Step / Before
# Make a line #plot with a step-before curve.
# ---
from h2o_wave import site, data, ui

page = site['/demo']

page.add('example', ui.plot_card(
    box='1 1 4 5',
    title='Line, step before',
    data=data('month price', 12, rows=[
        ('Jan', 51),
        ('Feb', 91),
        ('Mar', 34),
        ('Apr', 47),
        ('May', 63),
        ('June', 58),
        ('July', 56),
        ('Aug', 77),
        ('Sep', 99),
        ('Oct', 106),
        ('Nov', 88),
        ('Dec', 56),
    ]),
    plot=ui.plot([
        ui.mark(type='line', x='=month', y='=price', curve='step-before', y_min=0)
    ])
))

page.save()
