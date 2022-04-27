# Plot / Point / Custom
# Customize a plot's fill/stroke color, size and opacity.
# #plot
# ---
from h2o_wave import site, data, ui

page = site['/demo']

page.add('example', ui.plot_card(
    box='1 1 4 5',
    title='Point, custom',
    data=data('lifeExpectancy GDP population', 10, rows=[
        (75.32, 12779.37964, 40301927),
        (72.39, 9065.800825, 190010647),
        (80.653, 36319.23501, 33390141),
        (78.273, 8948.102923, 11416987),
        (72.961, 4959.114854, 1318683096),
        (82.208, 39724.97867, 6980412),
        (82.603, 31656.06806, 127467972),
        (76.423, 5937.029526, 3600523),
        (79.829, 36126.4927, 8199783),
        (79.441, 33692.60508, 10392226),
        (81.235, 34435.36744, 20434176),
        (80.204, 25185.00911, 4115771)
    ]),
    plot=ui.plot([ui.mark(type='point', x='=GDP', y='=lifeExpectancy', size='=population', size_range='4 30',
                          fill_color='#eb4559', stroke_color='#eb4559', stroke_size=1, fill_opacity=0.3,
                          stroke_opacity=1)])
))

page.save()
