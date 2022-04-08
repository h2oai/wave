# Plot / Interval / Polar / Stacked
# Make a #stacked rose #plot (a stacked bar plot in polar coordinates). #interval
# ---
from h2o_wave import site, data, ui

page = site['/demo']

page.add('example', ui.plot_card(
    box='1 1 4 5',
    title='Intervals, polar, stacked',
    data=data('city month rainfall', 16, rows=[
        ('London', 'Jan', 18.9),
        ('London', 'Feb', 28.8),
        ('London', 'Mar', 39.3),
        ('London', 'Apr', 31.4),
        ('London', 'May', 47),
        ('London', 'Jun', 20.3),
        ('London', 'Jul', 24),
        ('London', 'Aug', 35.6),
        ('Berlin', 'Jan', 12.4),
        ('Berlin', 'Feb', 23.2),
        ('Berlin', 'Mar', 34.5),
        ('Berlin', 'Apr', 29.7),
        ('Berlin', 'May', 42),
        ('Berlin', 'Jun', 35.5),
        ('Berlin', 'Jul', 37.4),
        ('Berlin', 'Aug', 42.4),
    ]),
    plot=ui.plot([
        ui.mark(
            coord='polar',
            type='interval',
            x='=month',
            y='=rainfall',
            color='=city',
            stack='auto',
            y_min=0,
            stroke_color='$card'
        )
    ])
))

page.save()
