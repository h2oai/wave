# Tall stat
# Create a vertical label-value pairs collection.
# ---
from h2o_wave import site, ui

page = site['/demo']

page.add('example', ui.tall_stats_card(
    box='1 1 2 4',
    items=[
        ui.stat(label='PARAMETER NAME', value='125%'),
        ui.stat(label='PARAMETER NAME', value='578 Users'),
        ui.stat(label='PARAMETER NAME', value='25K')
    ]
))

page.save()
