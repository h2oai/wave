# Plot / Area / Stacked
# Make a #stacked area #plot.
# ---
from h2o_wave import site, data, ui

page = site['/demo']

page.add('example', ui.plot_card(
    box='1 1 4 5',
    title='Area, stacked',
    data=data('country year value', 28, rows=[
        ('Asia', '1750', 502),
        ('Asia', '1800', 635),
        ('Asia', '1850', 809),
        ('Asia', '1900', 5268),
        ('Asia', '1950', 4400),
        ('Asia', '1999', 3634),
        ('Asia', '2050', 947),
        ('Africa', '1750', 106),
        ('Africa', '1800', 107),
        ('Africa', '1850', 111),
        ('Africa', '1900', 1766),
        ('Africa', '1950', 221),
        ('Africa', '1999', 767),
        ('Africa', '2050', 133),
        ('Europe', '1750', 163),
        ('Europe', '1800', 203),
        ('Europe', '1850', 276),
        ('Europe', '1900', 628),
        ('Europe', '1950', 547),
        ('Europe', '1999', 729),
        ('Europe', '2050', 408),
        ('Oceania', '1750', 200),
        ('Oceania', '1800', 200),
        ('Oceania', '1850', 200),
        ('Oceania', '1900', 460),
        ('Oceania', '1950', 230),
        ('Oceania', '1999', 300),
        ('Oceania', '2050', 300),
    ]),
    plot=ui.plot([
        ui.mark(type='area', x_scale='time', x='=year', y='=value', y_min=0, color='=country', stack='auto')
    ])
))

page.save()
