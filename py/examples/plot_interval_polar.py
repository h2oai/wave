# Plot / Interval / Polar
# Make a rose #plot (a bar plot in polar coordinates). #interval
# ---
from h2o_wave import site, data, ui

page = site['/demo']

page.add('example', ui.plot_card(
    box='1 1 4 5',
    title='Interval, polar',
    data=data('month rainfall', 16, rows=[
        ('Jan', 18.9),
        ('Feb', 28.8),
        ('Mar', 39.3),
        ('Apr', 31.4),
        ('May', 47),
        ('Jun', 20.3),
        ('Jul', 24),
        ('Aug', 35.6),
        ('Jan', 12.4),
        ('Feb', 23.2),
        ('Mar', 34.5),
        ('Apr', 29.7),
        ('May', 42),
        ('Jun', 35.5),
        ('Jul', 37.4),
        ('Aug', 42.4),
    ]),
    plot=ui.plot([ui.mark(coord='polar', type='interval', x='=month', y='=rainfall', y_min=0, stroke_color='$card')])
))

page.save()
