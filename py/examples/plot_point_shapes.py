# Plot / Point / Shapes
# Make a scatterplot with categories encoded as mark shapes.
# #plot
# ---
from h2o_wave import site, data, ui

page = site['/demo']

page.add('example', ui.plot_card(
    box='1 1 4 5',
    title='Point, shapes',
    data=data('gender height weight', 10, rows=[
        ('female', 170, 59),
        ('female', 159.1, 47.6),
        ('female', 166, 69.8),
        ('female', 176.2, 66.8),
        ('female', 160.2, 75.2),
        ('male', 180.3, 76.4),
        ('male', 164.5, 63.2),
        ('male', 173, 60.9),
        ('male', 183.5, 74.8),
        ('male', 175.5, 70),
    ]),
    plot=ui.plot([ui.mark(type='point', x='=weight', y='=height', shape='=gender')])
))

page.save()
