# Plot / Polygon
# Make a heatmap. #plot
# ---
from h2o_wave import site, data, ui

page = site['/demo']

page.add('example', ui.plot_card(
    box='1 1 4 5',
    title='Heatmap',
    data=data('year person sales', 10, rows=[
        ('2021', 'Joe', 10),
        ('2022', 'Jane', 58),
        ('2023', 'Ann', 114),
        ('2021', 'Tim', 31),
        ('2023', 'Joe', 96),
        ('2021', 'Jane', 55),
        ('2023', 'Jane', 5),
        ('2022', 'Tim', 85),
        ('2023', 'Tim', 132),
        ('2022', 'Joe', 54),
        ('2021', 'Ann', 78),
        ('2022', 'Ann', 18),
    ]),
    plot=ui.plot([ui.mark(type='polygon', x='=person', y='=year', color='=sales',
                color_range='#fee8c8 #fdbb84 #e34a33')])
))

page.save()
