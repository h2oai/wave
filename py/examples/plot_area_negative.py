# Plot / Area / Negative
# Make an area #plot showing positive and negative values.
# ---
from h2o_wave import site, data, ui

page = site['/demo']

page.add('example', ui.plot_card(
    box='1 1 5 5',
    title='Area, negative values',
    data=data('year value', 20, rows=[
        ('1996', 322),
        ('1997', 324),
        ('1998', -329),
        ('1999', 342),
        ('2000', -348),
        ('2001', -334),
        ('2002', 325),
        ('2003', 316),
        ('2004', 318),
        ('2005', -330),
        ('2006', 355),
        ('2007', -366),
        ('2008', -337),
        ('2009', -352),
        ('2010', -377),
        ('2011', 383),
        ('2012', 344),
        ('2013', 366),
        ('2014', -389),
        ('2015', 334),
    ]),
    plot=ui.plot([ui.mark(type='area', x='=year', y='=value')])
))

page.save()
