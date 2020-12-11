# Plot / Form
# Display a plot inside a form.
# ---

import pandas as pd
from h2o_wave import main, app, data, Q, ui


values = pd.DataFrame([
    ('C1', 18),
    ('C2', 24),
    ('C3', 28),
    ('C4', 27),
    ('C5', 19),
    ('C6', 18),
    ('C7', 21),
    ('C8', 16),
    ('C9', 17),
    ('C10', 19)],
    columns=['product', 'price'])


@app('/demo')
async def serve(q: Q):
    q.page.add('example', ui.form_card(
        box='1 1 4 -1',
        items=[
            ui.text_xl('Example 1'),
            ui.visualization(
                plot=ui.plot([ui.mark(type='interval', x='=product', y='=price', y_min=0)]),
                data=data(fields=['product', 'price'], rows=list(zip(values['product'], values['price'])), pack=True),
            ),
            ui.text_xl('Example 2'),
            ui.visualization(
                plot=ui.plot([ui.mark(type='interval', x='=product', y='=price', y_min=0)]),
                data=data(fields=['product', 'price'], rows=list(zip(values['product'], values['price'])), pack=True),
            ),
        ],
    ))
    await q.page.save()
