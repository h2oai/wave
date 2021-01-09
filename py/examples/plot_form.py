# Plot / Form
# Display a #plot inside a #form.
# ---
from h2o_wave import site, data, ui

page = site['/demo']

fruit_popularity = [('Apple', 55), ('Orange', 80), ('Banana', 45), ('Kiwifruit', 40),
                    ('Blueberry', 85), ('Grapes', 60), ('Pears', 65), ('Watermelon', 35), ]

v = page.add('example', ui.form_card(
    box='1 1 4 5',
    items=[
        ui.text_xl('Most popular fruits'),
        ui.visualization(
            plot=ui.plot([ui.mark(type='interval', x='=fruit', y='=popularity')]),
            data=data(fields='fruit popularity', rows=fruit_popularity, pack=True),
        ),
    ],
))

v.data = fruit_popularity

page.save()
