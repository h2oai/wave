# Stat / Label / Space
# Simple example of a stat card with a label that has spaces in it
# ----

from h2o_wave import site, ui

page = site['/demo']

page.add('example', ui.tall_stats_card(
    box='1 1 3 5',
    items=[
        ui.stat(label='PARAMETER       NAME      Some data', value='125%'),
        ui.stat(label='Category 1    x', value='578 Users'),

    ]
))

page.save()