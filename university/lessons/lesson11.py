# Lesson 11: Plotting
# # Let's render some cool graphs
# Wave provides a versatile plotting API based on [Leland Wilkinson's](https://en.wikipedia.org/wiki/Leland_Wilkinson) [Grammar of Graphics](http://www.springer.com/gp/book/9780387245447).
# 
# A *plot* is a layered graphic, created using `ui.plot()`. Each layer displays *marks*, described by `ui.mark()`. The layers are rendered on top of each other to produce the final plot.
# 
# `ui.mark()` describes a collection of marks, not one mark. Since each `ui.mark()` describes one layer in the plot, it follows that all the marks on a layer are of the same `type` (its *geometry*). A mark's `type` can be one of `point`, `interval`, `line`, `path`, `area`, `polygon`, `schema`, `edge`.
# 
# See [docs](https://wave.h2o.ai/docs/widgets/plots/overview) for more info.
# ## Your task
# Try changing the `type` attribute from "line" to "interval" and observe the changes.
# ---
from h2o_wave import main, app, Q, ui, data


@app('/demo')
async def serve(q: Q):
    q.page['example'] = ui.plot_card(
        box='1 1 5 4',
        title='Line group plot',
        data=data('month city temperature', 24, rows=[
            ('Jan', 'Tokyo', 7),
            ('Jan', 'London', 3.9),
            ('Feb', 'Tokyo', 6.9),
            ('Feb', 'London', 4.2),
            ('Mar', 'Tokyo', 9.5),
            ('Mar', 'London', 5.7),
            ('Apr', 'Tokyo', 14.5),
            ('Apr', 'London', 8.5),
            ('May', 'Tokyo', 18.4),
            ('May', 'London', 11.9),
            ('Jun', 'Tokyo', 21.5),
            ('Jun', 'London', 15.2),
            ('Jul', 'Tokyo', 25.2),
            ('Jul', 'London', 17),
            ('Aug', 'Tokyo', 26.5),
            ('Aug', 'London', 16.6),
            ('Sep', 'Tokyo', 23.3),
            ('Sep', 'London', 14.2),
            ('Oct', 'Tokyo', 18.3),
            ('Oct', 'London', 10.3),
            ('Nov', 'Tokyo', 13.9),
            ('Nov', 'London', 6.6),
            ('Dec', 'Tokyo', 9.6),
            ('Dec', 'London', 4.8),
        ]),
        plot=ui.plot([ui.mark(type='line', x='=month', y='=temperature', color='=city', y_min=0)])
    )
    await q.page.save()
