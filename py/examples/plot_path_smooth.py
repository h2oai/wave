# Plot / Path / Smooth
# Make a path #plot with a smooth curve.
# ---
from h2o_wave import site, data, ui

page = site['/demo']

page.add('example', ui.plot_card(
    box='1 1 4 5',
    title='Path, smooth',
    data=data('price performance', 10, rows=[
        (0.1, 0.6),
        (0.2, 0.5),
        (0.3, 0.3),
        (0.4, 0.2),
        (0.4, 0.5),
        (0.2, 0.2),
        (0.8, 0.5),
        (0.3, 0.3),
        (0.2, 0.4),
        (0.1, 0.0),
    ]),
    plot=ui.plot([ui.mark(type='path', x='=price', y='=performance', curve='smooth')])
))

page.save()
