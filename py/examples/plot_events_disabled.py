# Plot / Events/ Disabled
# Customize for which marks on a #plot card you do not wish to handle #events .
# ---
from h2o_wave import main, app, Q, ui, data


@app('/demo')
async def serve(q: Q):
    if not q.client.initialized:
        q.client.initialized = True
        q.page['example'] = ui.plot_card(
                box='1 1 4 5',
                title='Interval, range',
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
                plot=ui.plot([
                    ui.mark(type='line', x_scale='time', x='=year', y='=value', y_min=0, interactive=False), 
                    ui.mark(type='point', x='=year', y='=value', size=8, fill_color='red')
                ]),
                events=['select_marks'],
        )
        q.page['details'] = ui.markdown_card(
            box='1 6 4 2',
            title='Selected Year',
            content='Nothing selected.',
        )
    else:
        if q.events.example:
            q.page['details'].content = f'You selected {q.events.example.select_marks}'

    await q.page.save()
