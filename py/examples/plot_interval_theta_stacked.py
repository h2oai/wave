# Plot / Interval / Theta / Stacked
# Make a stacked "racetrack" #plot (a bar plot in polar coordinates, transposed). #interval
# ---
from h2o_wave import site, data, ui

page = site['/demo']

page.add('example', ui.plot_card(
    box='1 1 4 5',
    title='Intervals, theta, stacked',
    data=data('day type time', 10, rows=[
        ('Mon.','series1', 470),
        ('Mon.','series2', 700),
        ('Tues.','series1', 1800),
        ('Tues.','series2', 1300),
        ('Wed.','series1', 1650),
        ('Wed.','series2', 1900),
        ('Thur.','series1', 2500),
        ('Thur.','series2', 1470),
        ('Fri.','series1', 2800),
        ('Fri.','series2', 2260),
    ]),
    plot=ui.plot([
        ui.mark(
            coord='theta',
            type='interval', 
            x='=day', 
            y='=time',
            color='=type',
            stack='auto',
            y_min=0
        )
    ])
))

page.save()
