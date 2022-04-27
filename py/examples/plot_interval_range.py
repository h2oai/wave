# Plot / Interval / Range
# Make a column #plot with each bar representing high/low (or start/end) values.
# Transposing this produces a gantt plot. #interval #range
# ---
from h2o_wave import site, data, ui

page = site['/demo']

page.add('example', ui.plot_card(
    box='1 1 4 5',
    title='Interval, range',
    data=data('profession max min', 5, rows=[
        ('medicine', 110000, 23000),
        ('fire fighting', 120000, 18000),
        ('pedagogy', 125000, 24000),
        ('psychology', 130000, 22500),
        ('computer science', 151000, 36000),
    ]),
    plot=ui.plot([ui.mark(type='interval', x='=profession', y0='=min', y='=max')])
))

page.save()
