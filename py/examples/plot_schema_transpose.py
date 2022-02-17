# Plot / Schema / Transpose
# Make a horizontal box and whiskers plot.
# ---
from h2o_wave import site, data, ui

page = site['/demo']

page.add('example', ui.plot_card(
    box='1 1 4 5',
    title='Box plot',
    data=data(
        fields=['region', 'low', 'q1', 'q2', 'q3', 'high'],
        rows=[
            ['Oceania', 1, 9, 16, 22, 24],
            ['East Europe', 1, 5, 8, 12, 16],
            ['Australia', 1, 8, 12, 19, 26],
            ['South America', 2, 8, 12, 21, 28],
            ['North Africa', 1, 8, 14, 18, 24],
            ['North America', 3, 10, 17, 28, 30],
            ['West Europe', 1, 7, 10, 17, 22],
            ['West Africa', 1, 6, 8, 13, 16],
        ],
        pack=True,
    ),
    plot=ui.plot([ui.mark(
        type='schema',
        x1='=low',  # min
        x_q1='=q1',  # lower quartile
        x_q2='=q2',  # median
        x_q3='=q3',  # upper quartile
        x2='=high',  # max
        y='=region',
        fill_color='#ccf5ff',
    )])
))

page.save()
