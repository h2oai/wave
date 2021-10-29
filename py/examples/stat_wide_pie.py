# Stat / Pie / Wide
# Create a wide stat pie card displaying a pie chart.
# ---
from h2o_wave import site, ui

page = site['/demo']

page.add('example', ui.wide_pie_stat_card(
    box='1 1 3 3',
    title='Wide Pie Stat',
    pies=[
        ui.pie(label='Category 1', value='35%', fraction=0.35, color='#2cd0f5', aux_value='$ 35'),
        ui.pie(label='Category 2', value='65%', fraction=0.65, color='$themePrimary', aux_value='$ 65'),
    ],
))

page.save()
