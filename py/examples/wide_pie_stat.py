# Info / Wide
# Create a wide information card displaying a title, caption, and either an icon or image.
# ---
from h2o_wave import site, ui

page = site['/demo']

page.add('meta', ui.meta_card(box='', theme='default'))
page.add('example', ui.wide_pie_stat_card(
    box='1 1 3 3',
    title='Wide Pie Stat',
    pies=[
        ui.pie(label='Category 1', value='35%', fraction=0.35, color='#2cd0f5', aux_value='$ 35'),
        ui.pie(label='Category 2', value='65%', fraction=0.65, color='$themePrimary', aux_value='$ 65'),
    ],
))

page.save()
