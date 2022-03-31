# Plot / Interaction / Brush
# Make a scatterplot with brush enabled. #plot
# ---

from h2o_wave import main, app, Q, ui, data


@app('/demo')
async def serve(q: Q):
    q.page['example'] = ui.plot_card(
        box='1 1 4 5',
        title='Line plot brush',
        data=data('year value', 8, rows=[
            ('1991', 3),
            ('1992', 4),
            ('1993', 3.5),
            ('1994', 5),
            ('1995', 4.9),
            ('1996', 6),
            ('1997', 7),
            ('1998', 9),
            ('1999', 13),
        ]),
        plot=ui.plot([ui.mark(type='line', x_scale='time', x='=year', y='=value', y_min=0)]),
        interactions=['brush']
    )
    await q.page.save()
