# Plot / Line / Labels / Occlusion
# Make a line #plot with non-overlapping labels.
# ---
from h2o_wave import site, data, ui

page = site['/demo']

page.add('example', ui.plot_card(
    box='1 1 4 5',
    title='Line, remove overlaping labels',
    data=data('year price', 9, rows=[
        ('1991', 3),
        ('1992', 4),
        ('1993', 3.5),
        ('1994', 5),
        ('1995', 4.9),
        ('1996', 6),
        ('1997', 7),
        ('1998', 9),
        ('1999', 11),
        ('2000', 13.5),
        ('2001', 14),
        ('2002', 15),
        ('2003', 16),
        ('2004', 16.5),
        ('2005', 17),
        ('2006', 17.5),
        ('2007', 18),
        ('2008', 18.5),
    ]),
    plot=ui.plot([
        ui.mark(type='line', x_scale='time', x='=year', y='=price', y_min=0,
                label='=${{intl price minimum_fraction_digits=2 maximum_fraction_digits=2}}',
                label_overlap='hide')
    ])
))

page.save()
