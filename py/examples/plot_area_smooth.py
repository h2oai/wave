# Plot / Area / Smooth
# Make an area #plot with a smooth curve.
# ---
from h2o_wave import site, data, ui

page = site['/demo']

page.add('example', ui.plot_card(
    box='1 1 4 5',
    title='Area, smooth',
    data=data('year price', 9, rows=[
        ('1991', 15468),
        ('1992', 16100),
        ('1993', 15900),
        ('1994', 17409),
        ('1995', 17000),
        ('1996', 31056),
        ('1997', 31982),
        ('1998', 32040),
        ('1999', 33233),
    ]),
    plot=ui.plot([ui.mark(type='area', x_scale='time', x='=year', y='=price', curve='smooth', y_min=0)])
))

page.save()
