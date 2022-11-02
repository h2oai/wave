# Plot / Wide
# Create a wide plot card displaying a plot with title and caption.
# ---
from h2o_wave import site, ui, data

page = site['/demo']

page.add('example', ui.wide_plot_card(
    box='1 1 5 5',
    title='Wide Plot Card',
    caption='''
    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quia aliquam maxime quos facere
    necessitatibus tempore eum odio, qui illum. Repellat modi dolor facilis odio ex possimus
    ''',
    data=data('profession salary', 5, rows=[
        ('medicine', 23000),
        ('fire fighting', 18000),
        ('pedagogy', 24000),
        ('psychology', 22500),
        ('computer science', 36000),
    ]),
    plot=ui.plot([ui.mark(type='interval', x='=profession', y='=salary', y_min=0)])
))

page.save()
