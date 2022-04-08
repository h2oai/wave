# Plot / Interval / Stacked / Grouped
# Make a column #plot with both #stacked and grouped bars. #interval
# ---
from h2o_wave import site, data, ui

page = site['/demo']

page.add('example', ui.plot_card(
    box='1 1 4 5',
    title='Intervals, stacked and dodged',
    data=data('day type time gender', 12, rows=[
        ('Mon.','series1', 2800, 'male'),
        ('Mon.','series1', 1800, 'female'),
        ('Mon.','series2', 2260, 'female'),
        ('Mon.','series2', 710, 'male'),
        ('Tues.','series1', 1800, 'male'),
        ('Tues.','series1', 290, 'female'),
        ('Tues.','series2', 1300, 'female'),
        ('Tues.','series2', 960, 'male'),
        ('Wed.','series1', 950, 'male'),
        ('Wed.','series1', 2730, 'female'),
        ('Wed.','series2', 1390, 'male'),
        ('Wed.','series2', 900, 'female'),
    ]),
    plot=ui.plot([
        ui.mark(
            type='interval',
            x='=day',
            y='=time',
            color='=type',
            stack='auto',
            dodge='=gender',
            y_min=0
        )
    ])
))

page.save()
