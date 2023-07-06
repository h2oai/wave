
from h2o_wave import site, ui
disable_animations = '''
* {
    -webkit-animation: none !important;
    -moz-animation: none !important;
    -o-animation: none !important;
    -ms-animation: none !important;
    animation: none !important
}
'''
page = site['/3']
page.drop() # Drop any previous pages.
page['meta'] = ui.meta_card(box='', stylesheet=ui.inline_stylesheet(disable_animations))
from h2o_wave import data

page['example'] = ui.plot_card(
    box='1 1 4 5',
    title='Point',
    data=data('height weight', 10, rows=[
        (170, 59),
        (159.1, 47.6),
        (166, 69.8),
        (176.2, 66.8),
        (160.2, 75.2),
        (180.3, 76.4),
        (164.5, 63.2),
        (173, 60.9),
        (183.5, 74.8),
        (175.5, 70),
    ]),
    plot=ui.plot([ui.mark(type='point', x='=weight', y='=height')])
)

page.save()
    