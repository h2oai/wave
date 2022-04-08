# Plot / Area / Groups
# Make an area #plot showing multiple categories.
# ---
from h2o_wave import site, data, ui

page = site['/demo']

page.add('example', ui.plot_card(
    box='1 1 4 5',
    title='Area, groups',
    data=data('month city temperature', 24, rows=[
        ('Jan', 'Tokyo', 7),
        ('Jan', 'London', 3.9),
        ('Feb', 'Tokyo', 6.9),
        ('Feb', 'London', 4.2),
        ('Mar', 'Tokyo', 9.5),
        ('Mar', 'London', 5.7),
        ('Apr', 'Tokyo', 14.5),
        ('Apr', 'London', 8.5),
        ('May', 'Tokyo', 18.4),
        ('May', 'London', 11.9),
        ('Jun', 'Tokyo', 21.5),
        ('Jun', 'London', 15.2),
        ('Jul', 'Tokyo', 25.2),
        ('Jul', 'London', 17),
        ('Aug', 'Tokyo', 26.5),
        ('Aug', 'London', 16.6),
        ('Sep', 'Tokyo', 23.3),
        ('Sep', 'London', 14.2),
        ('Oct', 'Tokyo', 18.3),
        ('Oct', 'London', 10.3),
        ('Nov', 'Tokyo', 13.9),
        ('Nov', 'London', 6.6),
        ('Dec', 'Tokyo', 9.6),
        ('Dec', 'London', 4.8),
    ]),
    plot=ui.plot([
        ui.mark(type='area', x='=month', y='=temperature', color='=city', y_min=0)
    ])
))

page.save()
