# Plot / Area / Range
# Make an area #plot representing a range (band) of values.
# ---

from h2o_wave import site, data, ui

page = site['/demo']

day_temperature = [('2020-01-01', 10, 15), ('2020-01-02', 15, 17), ('2020-01-03', 24, 30), ('2020-01-04', 21, 25),
                   ('2020-01-05', 12, 18), ('2020-01-06', 16, 21), ('2020-01-07', 17, 24), ('2020-01-08', 22, 27),
                   ('2020-01-09', 20, 23), ('2020-01-10', 17, 23), ('2020-01-11', 12, 15), ('2020-01-12', 10, 15),
                   ('2020-01-13', 8, 14), ('2020-01-14', 10, 16), ('2020-01-15', 11, 14), ('2020-01-16', 12, 16)
                   ]

v = page.add('example', ui.plot_card(
    box='1 1 4 5',
    title='Area, range - Temperature',
    data=data('date low high', len(day_temperature)),
    plot=ui.plot([ui.mark(type='area', x_scale='time', x='=date', y0='=low', y='=high', y_min=300)])
))
v.data = day_temperature

page.save()
