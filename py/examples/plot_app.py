# Plot / App
# Make a #plot from an app.
# ---
from .synth import FakeMultiCategoricalSeries as F
from h2o_wave import main, app, data, Q, ui

n = 10
k = 5
f = F(groups=k)
values = [(g, t, x) for x in [f.next() for _ in range(n)] for g, t, x, dx in x]


@app('/demo')
async def serve(q: Q):
    v = q.page.add('example', ui.plot_card(
        box='1 1 4 6',
        title='Intervals, stacked',
        data=data('country product price', n * k),
        plot=ui.plot([ui.mark(
            coord='rect',
            type='interval',
            x='=product',
            y='=price',
            y_min=0,
            color='=country',
            stack='auto',
        )]),
    ))
    v.data = values
    await q.page.save()
