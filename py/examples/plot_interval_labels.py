# Plot / Interval / Labels
# Make a column #plot with labels on each bar. #interval
# ---
from h2o_wave import site, data, ui

page = site['/demo']

page.add('example', ui.plot_card(
    box='1 1 4 5',
    title='Label Customization',
    data=data('profession salary', 5, rows=[
        ('medicine', 33000),
        ('fire fighting', 18000),
        ('pedagogy', 24000),
        ('psychology', 22500),
        ('computer science', 36000),
    ]),
    plot=ui.plot([
        ui.mark(
            type='interval', 
            x='=profession',
            y='=salary', y_min=0,
            label='=${{intl price minimum_fraction_digits=2 maximum_fraction_digits=2}}',
            label_offset=0, label_position='middle', label_rotation='-90', label_fill_color='#fff',
            label_font_weight='bold'
        )
    ])
))

page.save()
