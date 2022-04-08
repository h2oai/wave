# Plot / Point / Annotation
# Add annotations (points, lines and regions) to a #plot.
# #annotation
# ---
from h2o_wave import site, data, ui

page = site['/demo']

page.add('example', ui.plot_card(
    box='1 1 4 5',
    title='Numeric-Numeric',
    data=data('height weight', 10, rows=[
        (170, 59),
        (159.1, 47.6),
        (166, 69.8),
        (176.2, 66.8),
        (160.2, 75.2),
        (180.3, 76.4),
        (164.5, 63.2),
        (173, 60.9),
        (183.5, 74.8),
        (175.5, 70),
    ]),
    plot=ui.plot([
        ui.mark(type='point', x='=weight', y='=height', x_min=0, x_max=100, y_min=0, y_max=100),  # the plot
        ui.mark(x=50, y=50, label='point'),  # A single reference point
        ui.mark(x=40, label='vertical line'),
        ui.mark(y=40, label='horizontal line'),
        ui.mark(x=70, x0=60, label='vertical region'),
        ui.mark(y=70, y0=60, label='horizontal region'),
        ui.mark(x=30, x0=20, y=30, y0=20, label='rectangular region')
    ])
))

page.save()
