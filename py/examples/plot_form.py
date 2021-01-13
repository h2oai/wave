# Plot / Form
# Display a #plot inside a #form.
# ---
from synth import FakeCategoricalSeries
from h2o_wave import site, data, ui

page = site['/demo']

n = 20
f = FakeCategoricalSeries()
v = page.add('example', ui.form_card(
    box='1 1 4 5',
    items=[
        ui.text_xl('Example 1'),
        ui.visualization(
            plot=ui.plot([ui.mark(type='interval', x='=product', y='=price', y_min=0)]),
            data=data(fields='product price', rows=[(c, x) for c, x, _ in [f.next() for _ in range(n)]], pack=True),
        ),
        ui.text_xl('Example 2'),
        ui.visualization(
            plot=ui.plot([ui.mark(type='interval', x='=product', y='=price', y_min=0)]),
            data=data(fields='product price', rows=[(c, x) for c, x, _ in [f.next() for _ in range(n)]], pack=True),
        ),
    ],
))

page.save()
