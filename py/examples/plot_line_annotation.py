# Plot / Line / Annotation
# Add annotations to a line #plot. #annotation
# ---
from h2o_wave import site, data, ui

page = site['/demo']

page.add('example', ui.plot_card(
    box='1 1 4 5',
    title='Line, annotation',
    data=data('year value', 8, rows=[
        ('1991', 3),
        ('1992', 4),
        ('1993', 3.5),
        ('1994', 5),
        ('1995', 4.9),
        ('1996', 6),
        ('1997', 7),
        ('1998', 9),
        ('1999', 13),
    ]),
    plot=ui.plot([
        ui.mark(type='line', x_scale='time', x='=year', y='=value', y_min=0),
        ui.mark(x='1994', y=13, label='point'),
        ui.mark(x='1993', label='vertical line'),
        ui.mark(y=6, label='horizontal line'),
        ui.mark(x='1996', x0='1995', label='vertical region'),
        ui.mark(y=8, y0=7, label='horizontal region'),
        ui.mark(x='1997', x0='1998', y=3, y0=4,
                label='rectangular region')
        ])
))

page.save()