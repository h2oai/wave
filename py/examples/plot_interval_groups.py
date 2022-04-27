# Plot / Interval / Groups
# Make a grouped column #plot. #interval
# ---
from h2o_wave import site, data, ui

page = site['/demo']

page.add('example', ui.plot_card(
    box='1 1 4 5',
    title='Intervals, groups',
    data=data('day type time', 10, rows=[
        ('Mon.','series1', 2800),
        ('Mon.','series2', 2260),
        ('Tues.','series1', 1800),
        ('Tues.','series2', 1300),
        ('Wed.','series1', 950),
        ('Wed.','series2', 900),
        ('Thur.','series1', 500),
        ('Thur.','series2', 390),
        ('Fri.','series1', 170),
        ('Fri.','series2', 100),
    ]),
    plot=ui.plot([ui.mark(type='interval', x='=day', y='=time', color='=type', dodge='auto', y_min=0)])
))

page.save()
