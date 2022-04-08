# Plot / Interval / Theta
# Make a "racetrack" #plot (a bar plot in polar coordinates, transposed). #interval
# ---
from h2o_wave import site, data, ui

page = site['/demo']

page.add('example', ui.plot_card(
    box='1 1 4 5',
    title='Intervals, theta',
    data=data('question percent', 8, rows=[
        ('Question 1', 0.21),
        ('Question 2', 0.4),
        ('Question 3', 0.49),
        ('Question 4', 0.52),
        ('Question 5', 0.53),
        ('Question 6', 0.84),
        ('Question 7', 0.88),
        ('Question 8', 0.9),
    ]),
    plot=ui.plot([
        ui.mark(coord='theta', type='interval', x='=question', y='=percent', stack='auto', y_min=0)
    ])
))

page.save()
