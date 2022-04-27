# Plot / Line / Labels / Custom
# Add labels to a line #plot.
# ---
from h2o_wave import site, data, ui

page = site['/demo']

page.add('example', ui.plot_card(
    box='1 1 4 5',
    title='Line, labels, custom',
    data=data('year price', 9, rows=[
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
      ui.mark(type='line', x_scale='time', x='=year', y='=price', y_min=0,
              label='=${{intl price minimum_fraction_digits=2 maximum_fraction_digits=2}}',
              label_fill_color='rgba(0,0,0,0.65)', label_stroke_color='$red', label_stroke_size=2)
    ])
))

page.save()
