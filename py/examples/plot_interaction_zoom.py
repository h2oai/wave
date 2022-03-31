# Plot / Interaction / Zoom
# Make a scatterplot with zoom enabled. #plot
# ---

from h2o_wave import main, app, Q, ui, data


@app('/demo')
async def serve(q: Q):
    q.page['example'] = ui.plot_card(
        box='1 1 4 5',
        title='Point plot zoom',
        data=data('height weight', 10, rows=[
            (170, 59),
            (159.1, 47.6),
            (166, 69.8),
            (176.2, 66.8),
            (160.2, 75.2),
            (180.3, 76.4),
            (164.5, 63.2),
            (173, 60.9),
            (183.5, 74.8),
            (175.5, 70),
        ]),
        interactions=['scale_zoom'],
        plot=ui.plot([ui.mark(type='point', x='=weight', y='=height')])
    )
    await q.page.save()
