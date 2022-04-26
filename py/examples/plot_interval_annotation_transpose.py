# Plot / Interval / Annotation / Transpose
# Add annotations to a bar #plot. #annotation #interval
# ---
from h2o_wave import site, data, ui

page = site['/demo']

page.add('example', ui.plot_card(
    box='1 1 4 5',
    title='Categorical-Numeric',
    data=data('profession salary', 5, rows=[
        ('medicine', 23000),
        ('fire fighting', 18000),
        ('pedagogy', 24000),
        ('psychology', 22500),
        ('computer science', 36000),
    ]),
    plot=ui.plot([
        ui.mark(type='interval', x='=salary', y='=profession'),
        ui.mark(y='fire fighting', x=23000, label='point'),
        ui.mark(y='pedagogy', label='vertical line'),
        ui.mark(x=27000, label='horizontal line'),
        ui.mark(y='computer science', y0='psychology', label='horizontal region'),
        ui.mark(x=35000, x0=30000, label='vertical region')
    ])
))

page.save()
