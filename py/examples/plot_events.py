# Plot / Events
# Handle #events on a #plot card.
# ---
from h2o_wave import main, app, Q, ui, data


@app('/demo')
async def serve(q: Q):
    if not q.client.initialized:
        q.client.initialized = True
        q.page['pricing'] = ui.plot_card(
            box='1 1 4 5',
            title='Interval',
            data=data(fields='product price', rows=[
                ['spam', 1.49],
                ['eggs', 2.49],
                ['ham', 1.99],
            ], pack=True),
            plot=ui.plot([ui.mark(type='interval', x='=product', y='=price', y_min=0)]),
            events=['select_marks']
        )
        q.page['details'] = ui.markdown_card(
            box='1 6 4 2',
            title='Selected Product',
            content='Nothing selected.',
        )
    else:
        if q.events.pricing:
            q.page['details'].content = f'You selected {q.events.pricing.select_marks}'

    await q.page.save()
