# Plot / App
# Make a #plot from an app.
# ---
from h2o_wave import main, app, data, Q, ui

fruit_popularity = [('AZ', 'Apple', 55), ('AZ', 'Orange', 80), ('AZ', 'Banana', 45),
                    ('CA', 'Apple', 65), ('CA', 'Orange', 95), ('CA', 'Banana', 55),
                    ('FL', 'Apple', 45), ('FL', 'Orange', 50), ('FL', 'Banana', 55),
                    ('NY', 'Apple', 70), ('NY', 'Orange', 110), ('NY', 'Banana', 80),
                    ('TX', 'Apple', 50), ('TX', 'Orange', 90), ('TX', 'Banana', 85), ]


@app('/demo')
async def serve(q: Q):
    v = q.page.add('example', ui.plot_card(
        box='1 1 4 6',
        title='Intervals, stacked - Fruit popularity in different states',
        data=data('state fruit popularity', len(fruit_popularity)),
        plot=ui.plot([ui.mark(
            coord='rect',
            type='interval',
            x='=state',
            y='=popularity',
            y_min=0,
            color='=fruit',
            stack='auto',
        )]),
    ))
    v.data = fruit_popularity
    await q.page.save()
