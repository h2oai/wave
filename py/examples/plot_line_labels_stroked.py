# Plot / Line / Labels/ Stroked
# Customize label rendering: add a subtle outline to labels to improve readability.
# #plot
# ---
from h2o_wave import site, data, ui

page = site['/demo']

ice_cream_sales = [('2020-01-01', 650), ('2020-01-02', 600), ('2020-01-03', 450), ('2020-01-04', 530),
                   ('2020-01-05', 490), ('2020-01-06', 540), ('2020-01-07', 550), ('2020-01-08', 580),
                   ('2020-01-09', 570), ('2020-01-10', 610), ('2020-01-11', 630), ('2020-01-12', 680),
                   ('2020-01-13', 720), ('2020-01-14', 690), ('2020-01-15', 630), ('2020-01-16', 610),
                   ('2020-01-07', 612), ('2020-01-18', 614), ('2020-01-19', 613), ('2020-01-20', 620),
                   ('2020-01-21', 615), ('2020-01-22', 608), ('2020-01-23', 610), ('2020-01-24', 605),
                   ('2020-01-25', 600), ('2020-01-26', 610), ('2020-01-27', 630), ('2020-01-28', 680),
                   ('2020-01-29', 750), ('2020-01-30', 720), ('2020-01-31', 730), ('2020-02-01', 700)
                   ]

v = page.add('example', ui.plot_card(
    box='1 1 4 5',
    title='Line - Ice Cream Sales',
    data=data('date sales', len(ice_cream_sales)),
    plot=ui.plot([ui.mark(type='line', x_scale='time', x='=date', y='=sales', y_min=300, label='={{intl sales}}',
                          label_fill_color='rgba(0,0,0,0.65)', label_stroke_color='#fff', label_stroke_size=2)])))

v.data = ice_cream_sales

page.save()
