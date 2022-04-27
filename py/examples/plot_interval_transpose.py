# Plot / Interval / Transpose
# Make a bar #plot. #interval
# ---
from h2o_wave import site, data, ui

page = site['/demo']

page.add('example', ui.plot_card(
    box='1 1 4 5',
    title='Interval transposed',
    data=data('profession salary', 5, rows=[
        ('medicine', 33000),
        ('fire fighting', 18000),
        ('pedagogy', 24000),
        ('psychology', 22500),
        ('computer science', 36000),
    ]),
    plot=ui.plot([ui.mark(type='interval', x='=salary', y='=profession', y_min=0)])
))

page.save()
