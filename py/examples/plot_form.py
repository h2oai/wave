# Plot / Form
# Display a #plot inside a #form.
# ---
from h2o_wave import site, data, ui

page = site['/demo']

page.add('example', ui.form_card(
    box='1 1 -1 8',
    items=[
        ui.text_xl('This year'),
        ui.visualization(
            plot=ui.plot([ui.mark(type='interval', x='=profession', y='=salary', y_min=0)]),
            data=data(fields='profession salary', rows=[
                ('medicine', 23000),
                ('fire fighting', 18000),
                ('pedagogy', 24000),
                ('psychology', 22500),
                ('computer science', 36000),
            ], pack=True),
        ),
        ui.text_xl('Last year'),
        ui.visualization(
            plot=ui.plot([ui.mark(type='interval', x='=profession', y='=salary', y_min=0)]),
            data=data(fields='profession salary', rows=[
                ('medicine', 21000),
                ('fire fighting', 17000),
                ('pedagogy', 23500),
                ('psychology', 22300),
                ('computer science', 33000),
            ], pack=True)
        ),
    ],
))

page.save()
