# Plot / Interval / Annotation
# Add annotations to a column #plot. #annotation #interval
# ---
from h2o_wave import site, data, ui

page = site['/demo']

page.add('example', ui.plot_card(
    box='1 1 4 5',
    title='Interval - annotation',
    data=data('profession salary', 5, rows=[
        ('medicine', 23000),
        ('fire fighting', 18000),
        ('pedagogy', 24000),
        ('psychology', 22500),
        ('computer science', 36000),
    ]),
    plot=ui.plot([
        ui.mark(type='interval', x='=profession', y='=salary', y_min=0),
        ui.mark(x='psychology', y=32000, label='point'),
        ui.mark(x='pedagogy', label='vertical line'),
        ui.mark(y=23000, label='horizontal line'),
        ui.mark(x='fire fighting', x0='medicine', label='vertical region'),
        ui.mark(y=35000, y0=30000, label='horizontal region')
    ])
))

page.save()
