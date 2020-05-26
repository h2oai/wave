from telesync import Site, data, pack, plot
from synth import FakeTimeSeries, FakeScatter, FakeMultiTimeSeries, FakeCategoricalSeries, FakeMultiCategoricalSeries, \
    FakeSeries
import random


def create_point(key, page, box):
    n = 50
    f = FakeScatter()
    v = page.add(key, dict(
        view='plot',
        box=box,
        title='Point',
        data=data('price performance', n),
        vis=pack(plot(mark='point', x='=price', y='=performance'))
    ))
    v.data = [f.next() for i in range(n)]


def create_point_sizes(key, page, box):
    n = 40
    f = FakeScatter()
    v = page.add(key, dict(
        view='plot',
        box=box,
        title='Point, sized',
        data=data('price performance discount', n),
        vis=pack(plot(mark='point', x='=price', y='=performance', size='=discount'))
    ))
    v.data = [(x, y, random.randint(1, 10)) for x, y in [f.next() for i in range(n)]]


def create_point_custom(key, page, box):
    n = 40
    f = FakeScatter()
    v = page.add(key, dict(
        view='plot',
        box=box,
        title='Point, custom',
        data=data('price performance discount', n),
        vis=pack(plot(mark='point', x='=price', y='=performance', size='=discount', size_range='4 30',
                      fill_color='#eb4559', stroke_color='#eb4559', stroke_size=1, fill_opacity=0.3,
                      stroke_opacity=1))
    ))
    v.data = [(x, y, random.randint(1, 10)) for x, y in [f.next() for i in range(n)]]


def create_fake_row(g, f, n):
    return [(g, x, y) for x, y in [f.next() for i in range(n)]]


def create_point_groups(key, page, box):
    n = 30
    f1, f2, f3 = FakeScatter(), FakeScatter(), FakeScatter()
    v = page.add(key, dict(
        view='plot',
        box=box,
        title='Point, groups',
        data=data('product price performance', n * 3),
        vis=pack(plot(mark='point', x='=price', y='=performance', color='=product', shape='circle'))
    ))
    v.data = create_fake_row('G1', f1, n) + create_fake_row('G2', f1, n) + create_fake_row('G3', f1, n)


def create_point_shapes(key, page, box):
    n = 30
    f1, f2 = FakeScatter(), FakeScatter()
    v = page.add(key, dict(
        view='plot',
        box=box,
        title='Point, shapes',
        data=data('product price performance', n * 2),
        vis=pack(plot(mark='point', x='=price', y='=performance', shape='=product', shape_range='circle square'))
    ))
    v.data = create_fake_row('G1', f1, n) + create_fake_row('G2', f1, n)


def create_line(key, page, box):
    n = 50
    f = FakeTimeSeries()
    v = page.add(key, dict(
        view='plot',
        box=box,
        title='Line',
        data=data('date price', n),
        vis=pack(plot(mark='line', x_scale='time', x='=date', y='=price', y_min=0))
    ))
    v.data = [(t, x) for t, x, dx in [f.next() for i in range(n)]]


def create_line_smooth(key, page, box):
    n = 50
    f = FakeTimeSeries()
    v = page.add(key, dict(
        view='plot',
        box=box,
        title='Line, smooth',
        data=data('date price', n),
        vis=pack(plot(mark='line', x_scale='time', x='=date', y='=price', curve='smooth', y_min=0))
    ))
    v.data = [(t, x) for t, x, dx in [f.next() for i in range(n)]]


def create_line_groups(key, page, box):
    n = 50
    f = FakeMultiTimeSeries()
    v = page.add(key, dict(
        view='plot',
        box=box,
        title='Line, groups',
        data=data('product date price', n * 5),
        vis=pack(plot(mark='line', x_scale='time', x='=date', y='=price', color='=product', y_min=0))
    ))

    v.data = [(g, t, x) for x in [f.next() for i in range(n)] for g, t, x, dx in x]


def create_step(key, page, box):
    n = 50
    f = FakeTimeSeries()
    v = page.add(key, dict(
        view='plot',
        box=box,
        title='Line, step',
        data=data('date price', n),
        vis=pack(plot(mark='line', x_scale='time', x='=date', y='=price', curve='step', y_min=0))
    ))

    v.data = [(t, x) for t, x, dx in [f.next() for i in range(n)]]


def create_step_before(key, page, box):
    n = 50
    f = FakeTimeSeries()
    v = page.add(key, dict(
        view='plot',
        box=box,
        title='Line, step-left',
        data=data('date price', n),
        vis=pack(plot(mark='line', x_scale='time', x='=date', y='=price', curve='step-before', y_min=0))
    ))
    v.data = [(t, x) for t, x, dx in [f.next() for i in range(n)]]


def create_step_after(key, page, box):
    n = 50
    f = FakeTimeSeries()
    v = page.add(key, dict(
        view='plot',
        box=box,
        title='Line, step-right',
        data=data('date price', n),
        vis=pack(plot(mark='line', x_scale='time', x='=date', y='=price', curve='step-after', y_min=0))
    ))
    v.data = [(t, x) for t, x, dx in [f.next() for i in range(n)]]


def create_path(key, page, box):
    n = 50
    f = FakeScatter()
    v = page.add(key, dict(
        view='plot',
        box=box,
        title='Path',
        data=data('profit sales', n),
        vis=pack(plot(mark='path', x='=profit', y='=sales'))
    ))
    v.data = [(x, y) for x, y in [f.next() for i in range(n)]]


def create_path_point(key, page, box):
    n = 50
    f = FakeScatter()
    v = page.add(key, dict(
        view='plot',
        box=box,
        title='Path + Point',
        data=data('profit sales', n),
        vis=pack(
            plot(mark='path', x='=profit', y='=sales') +
            plot(mark='point', x='=profit', y='=sales'),
        )
    ))
    v.data = [(x, y) for x, y in [f.next() for i in range(n)]]


def create_path_smooth(key, page, box):
    n = 50
    f = FakeScatter()
    v = page.add(key, dict(
        view='plot',
        box=box,
        title='Path, smooth',
        data=data('profit sales', n),
        vis=pack(plot(mark='path', x='=profit', y='=sales', curve='smooth'))
    ))
    v.data = [(x, y) for x, y in [f.next() for i in range(n)]]


def create_area(key, page, box):
    n = 50
    f = FakeTimeSeries()
    v = page.add(key, dict(
        view='plot',
        box=box,
        title='Area',
        data=data('date price', n),
        vis=pack(plot(mark='area', x_scale='time', x='=date', y='=price', y_min=0))
    ))
    v.data = [(t, x) for t, x, dx in [f.next() for i in range(n)]]


def create_area_smooth(key, page, box):
    n = 50
    f = FakeTimeSeries()
    v = page.add(key, dict(
        view='plot',
        box=box,
        title='Area, smooth',
        data=data('date price', n),
        vis=pack(plot(mark='area', x_scale='time', x='=date', y='=price', curve='smooth', y_min=0))
    ))
    v.data = [(t, x) for t, x, dx in [f.next() for i in range(n)]]


def create_area_groups(key, page, box):
    n = 50
    f = FakeMultiTimeSeries()
    v = page.add(key, dict(
        view='plot',
        box=box,
        title='Area, groups',
        data=data('product date price', n * 5),
        vis=pack(plot(mark='area', x_scale='time', x='=date', y='=price', color='=product', y_min=0))
    ))

    v.data = [(g, t, x) for x in [f.next() for i in range(n)] for g, t, x, dx in x]


def create_area_line(key, page, box):
    n = 50
    f = FakeTimeSeries()
    v = page.add(key, dict(
        view='plot',
        box=box,
        title='Area + Line',
        data=data('date price', n),
        vis=pack(
            plot(mark='area', x_scale='time', x='=date', y='=price', y_min=0) +
            plot(mark='line', x='=date', y='=price')
        )
    ))
    v.data = [(t, x) for t, x, dx in [f.next() for i in range(n)]]


def create_area_line_smooth(key, page, box):
    n = 50
    f = FakeTimeSeries()
    v = page.add(key, dict(
        view='plot',
        box=box,
        title='Area + Line, smooth',
        data=data('date price', n),
        vis=pack(
            plot(mark='area', x_scale='time', x='=date', y='=price', curve='smooth', y_min=0) +
            plot(mark='line', x='=date', y='=price', curve='smooth')
        )
    ))
    v.data = [(t, x) for t, x, dx in [f.next() for i in range(n)]]


def create_area_line_groups(key, page, box):
    n = 50
    f = FakeMultiTimeSeries()
    v = page.add(key, dict(
        view='plot',
        box=box,
        title='Area + Line, groups',
        data=data('product date price', n * 5),
        vis=pack(
            plot(mark='area', x_scale='time', x='=date', y='=price', color='=product', y_min=0) +
            plot(mark='line', x='=date', y='=price', color='=product')
        )
    ))

    v.data = [(g, t, x) for x in [f.next() for i in range(n)] for g, t, x, dx in x]


def create_area_negative(key, page, box):
    n = 50
    f = FakeTimeSeries(min=-50, max=50, start=0)
    v = page.add(key, dict(
        view='plot',
        box=box,
        title='Area, negative values',
        data=data('date price', n),
        vis=pack(plot(mark='area', x_scale='time', x='=date', y='=price'))
    ))
    v.data = [(t, x) for t, x, dx in [f.next() for i in range(n)]]


def create_area_stacked(key, page, box):
    n = 50
    f = FakeMultiTimeSeries()
    v = page.add(key, dict(
        view='plot',
        box=box,
        title='Area, stacked',
        data=data('product date price', n * 5),
        vis=pack(plot(mark='area', x_scale='time', x='=date', y='=price', color='=product', stack='auto', y_min=0))
    ))

    v.data = [(g, t, x) for x in [f.next() for i in range(n)] for g, t, x, dx in x]


def create_area_range(key, page, box):
    n = 50
    f = FakeTimeSeries()
    v = page.add(key, dict(
        view='plot',
        box=box,
        title='Area, range',
        data=data('date low high', n),
        vis=pack(plot(mark='area', x_scale='time', x='=date', y0='=low', y='=high'))
    ))
    v.data = [(t, x - random.randint(3, 8), x + random.randint(3, 8)) for t, x, dx in [f.next() for i in range(n)]]


def create_interval(key, page, box):
    n = 20
    f = FakeCategoricalSeries()
    v = page.add(key, dict(
        view='plot',
        box=box,
        title='Interval',
        data=data('product price', n),
        vis=pack(plot(mark='interval', x='=product', y='=price', y_min=0))
    ))
    v.data = [(c, x) for c, x, dx in [f.next() for i in range(n)]]


def create_histogram(key, page, box):
    n = 10
    f = FakeCategoricalSeries()
    v = page.add(key, dict(
        view='plot',
        box=box,
        title='Histogram',
        data=data('lo hi price', n),
        vis=pack(plot(mark='interval', y='=price', x1='=lo', x2='=hi', y_min=0))
    ))
    v.data = [(i * 10, i * 10 + 10, x) for i, (c, x, dx) in enumerate([f.next() for i in range(n)])]


def create_interval_range(key, page, box):
    n = 20
    f = FakeCategoricalSeries()
    v = page.add(key, dict(
        view='plot',
        box=box,
        title='Interval, range',
        data=data('product low high', n),
        vis=pack(plot(mark='interval', x='=product', y0='=low', y='=high'))
    ))
    v.data = [(c, x - random.randint(3, 10), x + random.randint(3, 10)) for c, x, dx in [f.next() for i in range(n)]]


def create_interval_groups(key, page, box):
    n = 10
    k = 3
    f = FakeMultiCategoricalSeries(groups=k)
    v = page.add(key, dict(
        view='plot',
        box=box,
        title='Intervals, groups',
        data=data('country product price', n * k),
        vis=pack(plot(mark='interval', x='=product', y='=price', color='=country', dodge='auto', y_min=0))
    ))

    v.data = [(g, t, x) for x in [f.next() for i in range(n)] for g, t, x, dx in x]


def create_interval_stacked(key, page, box):
    n = 10
    k = 5
    f = FakeMultiCategoricalSeries(groups=k)
    v = page.add(key, dict(
        view='plot',
        box=box,
        title='Intervals, stacked',
        data=data('country product price', n * k),
        vis=pack(plot(mark='interval', x='=product', y='=price', color='=country', stack='auto', y_min=0))
    ))

    v.data = [(g, t, x) for x in [f.next() for i in range(n)] for g, t, x, dx in x]


def create_interval_polar_stacked(key, page, box):
    n = 10
    k = 5
    f = FakeMultiCategoricalSeries(groups=k)
    v = page.add(key, dict(
        view='plot',
        box=box,
        title='Intervals, polar, stacked',
        data=data('country product price', n * k),
        vis=pack(
            plot(coord='polar', mark='interval', x='=product', y='=price', color='=country', stack='auto', y_min=0))
    ))

    v.data = [(g, t, x) for x in [f.next() for i in range(n)] for g, t, x, dx in x]


def create_interval_stacked_grouped(key, page, box):
    n = 5
    k = 5
    f1 = FakeMultiCategoricalSeries(groups=k)
    f2 = FakeMultiCategoricalSeries(groups=k)
    v = page.add(key, dict(
        view='plot',
        box=box,
        title='Intervals, stacked and dodged',
        data=data('category country product price', n * k * 2),
        vis=pack(
            plot(mark='interval', x='=product', y='=price', color='=country', stack='auto', dodge='=category', y_min=0))
    ))

    data1 = [('A', g, t, x) for x in [f1.next() for i in range(n)] for g, t, x, dx in x]
    data2 = [('B', g, t, x) for x in [f2.next() for i in range(n)] for g, t, x, dx in x]
    v.data = data1 + data2


def create_interval_helix(key, page, box):
    n = 200
    f = FakeCategoricalSeries()
    v = page.add(key, dict(
        view='plot',
        box=box,
        title='Interval, helix',
        data=data('product price', n),
        vis=pack(plot(coord='helix', mark='interval', x='=product', y='=price', y_min=0))
    ))
    v.data = [(c, x) for c, x, dx in [f.next() for i in range(n)]]


def create_interval_polar(key, page, box):
    n = 24
    f = FakeCategoricalSeries()
    v = page.add(key, dict(
        view='plot',
        box=box,
        title='Interval, polar',
        data=data('product price', n),
        vis=pack(plot(coord='polar', mark='interval', x='=product', y='=price', y_min=0))
    ))
    v.data = [(c, x) for c, x, dx in [f.next() for i in range(n)]]


def create_interval_theta(key, page, box):
    n = 10
    k = 5
    f = FakeMultiCategoricalSeries(groups=k)
    v = page.add(key, dict(
        view='plot',
        box=box,
        title='Intervals, theta, stacked',
        data=data('country product price', n * k),
        vis=pack(
            plot(coord='theta', mark='interval', x='=product', y='=price', color='=country', stack='auto', y_min=0))
    ))
    v.data = [(g, t, x) for x in [f.next() for i in range(n)] for g, t, x, dx in x]


def create_polygon(key, page, box):
    k1, k2 = 20, 10
    f = FakeSeries()
    v = page.add(key, dict(
        view='plot',
        box=box,
        title='Heatmap',
        data=data('country product profit', k1 * k2),
        vis=pack(
            plot(mark='polygon', x='=country', y='=product', color='=profit', color_range='#fee8c8 #fdbb84 #e34a33'))
    ))
    data = []
    for i in range(k1):
        for j in range(k2):
            x, dx = f.next()
            data.append((f'A{i + 1}', f'B{j + 1}', x))
    v.data = data


def create_point_map(key, page, box):
    k1, k2 = 20, 10
    f = FakeSeries()
    v = page.add(key, dict(
        view='plot',
        box=box,
        title='Points, size-encoded',
        data=data('country product profit', k1 * k2),
        vis=pack(plot(mark='point', x='=country', y='=product', size='=profit', shape='circle'))
    ))
    data = []
    for i in range(k1):
        for j in range(k2):
            x, dx = f.next()
            data.append((f'A{i + 1}', f'B{j + 1}', x))
    v.data = data


def create_line_labels(key, page, box):
    n = 50
    f = FakeTimeSeries()
    v = page.add(key, dict(
        view='plot',
        box=box,
        title='Labels',
        data=data('date price', n),
        vis=pack(plot(mark='line', x_scale='time', x='=date', y='=price', y_min=0,
                      label='=${{intl price minimum_fraction_digits=2 maximum_fraction_digits=2}}'))
    ))
    v.data = [(t, x) for t, x, dx in [f.next() for i in range(n)]]


def create_line_labels_stroked(key, page, box):
    n = 50
    f = FakeTimeSeries()
    v = page.add(key, dict(
        view='plot',
        box=box,
        title='Labels, less messy',
        data=data('date price', n),
        vis=pack(plot(mark='line', x_scale='time', x='=date', y='=price', y_min=0,
                      label='=${{intl price minimum_fraction_digits=2 maximum_fraction_digits=2}}',
                      label_fill_color='rgba(0,0,0,0.65)', label_stroke_color='#fff', label_stroke_size=2))
    ))
    v.data = [(t, x) for t, x, dx in [f.next() for i in range(n)]]


def create_line_labels_no_overlap(key, page, box):
    n = 50
    f = FakeTimeSeries()
    v = page.add(key, dict(
        view='plot',
        box=box,
        title='Remove overlapping labels',
        data=data('date price', n),
        vis=pack(plot(mark='line', x_scale='time', x='=date', y='=price', y_min=0,
                      label='=${{intl price minimum_fraction_digits=2 maximum_fraction_digits=2}}',
                      label_overlap='hide'))
    ))
    v.data = [(t, x) for t, x, dx in [f.next() for i in range(n)]]


def create_interval_labels(key, page, box):
    n = 20
    f = FakeCategoricalSeries()
    v = page.add(key, dict(
        view='plot',
        box=box,
        title='Label Customization',
        data=data('product price', n),
        vis=pack(
            plot(mark='interval', x='=product',
                 y='=${{intl price minimum_fraction_digits=2 maximum_fraction_digits=2}}', y_min=0,
                 color='#333333',
                 label='=${{intl price minimum_fraction_digits=2 maximum_fraction_digits=2}}',
                 label_offset=0, label_position='middle', label_rotation=-90, label_fill_color='#fff',
                 label_font_weight='bold'))
    ))
    v.data = [(c, x) for c, x, dx in [f.next() for i in range(n)]]


def create_point_annotation(key, page, box):
    n = 50
    f = FakeScatter()
    v = page.add(key, dict(
        view='plot',
        box=box,
        title='Numeric-Numeric',
        data=data('price performance', n),
        vis=pack(
            plot(mark='point', x='=price', y='=performance', x_min=0, x_max=100, y_min=0, y_max=100) +
            plot(x=50, y=50, label='point') +
            plot(x=40, label='vertical line') +
            plot(y=40, label='horizontal line') +
            plot(x=70, x0=60, label='vertical region') +
            plot(y=70, y0=60, label='horizontal region') +
            plot(x=30, x0=20, y=30, y0=20, label='rectangular region')
        )
    ))
    v.data = [f.next() for i in range(n)]


def create_line_annotation(key, page, box):
    n = 50
    f = FakeTimeSeries()
    v = page.add(key, dict(
        view='plot',
        box=box,
        title='Time-Numeric',
        data=data('date price', n),
        vis=pack(
            plot(mark='line', x_scale='time', x='=date', y='=price', y_min=0, y_max=100) +
            plot(x=50, y=50, label='point') +
            plot(x='2010-05-15T19:59:21.000000Z', label='vertical line') +
            plot(y=40, label='horizontal line') +
            plot(x='2010-05-24T19:59:21.000000Z', x0='2010-05-20T19:59:21.000000Z', label='vertical region') +
            plot(y=70, y0=60, label='horizontal region') +
            plot(x='2010-05-10T19:59:21.000000Z', x0='2010-05-05T19:59:21.000000Z', y=30, y0=20,
                 label='rectangular region')
        )
    ))
    v.data = [(t, x) for t, x, dx in [f.next() for i in range(n)]]


def create_interval_annotation(key, page, box):
    n = 20
    f = FakeCategoricalSeries()
    v = page.add(key, dict(
        view='plot',
        box=box,
        title='Categorical-Numeric',
        data=data('product price', n),
        vis=pack(
            plot(mark='interval', x='=product', y='=price', y_min=0, y_max=100) +
            plot(x='C10', y=80, label='point') +
            plot(x='C13', label='vertical line') +
            plot(y=40, label='horizontal line') +
            plot(x='C6', x0='C3', label='vertical region') +
            plot(y=70, y0=60, label='horizontal region')
        )
    ))
    v.data = [(c, x) for c, x, dx in [f.next() for i in range(n)]]


def create_point_page(site: Site):
    page = site['/vis/point']
    page.drop()

    create_point('point', page, '1 1 4 5')
    create_point_groups('point_groups', page, '5 1 4 5')
    create_point_shapes('point_shapes', page, '9 1 4 5')
    create_point_sizes('point_sizes', page, '1 6 4 5')
    create_point_custom('point_custom', page, '5 6 4 5')

    page.sync()


def create_line_page(site: Site):
    page = site['/vis/line']
    page.drop()

    create_line('line', page, '1 1 4 3')
    create_line_smooth('line_smooth', page, '5 1 4 3')
    create_line_groups('line_groups', page, '9 1 4 3')
    create_step_before('step_before', page, '1 4 4 3')
    create_step('step', page, '5 4 4 3')
    create_step_after('step_after', page, '9 4 4 3')
    create_path('path', page, '1 7 4 3')
    create_path_smooth('path_smooth', page, '5 7 4 3')
    create_path_point('path_point', page, '9 7 4 3')

    page.sync()


def create_area_page(site: Site):
    page = site['/vis/area']
    page.drop()

    create_area('area', page, '1 1 4 3')
    create_area_smooth('area_smooth', page, '5 1 4 3')
    create_area_groups('area_groups', page, '9 1 4 3')
    create_area_line('area_line', page, '1 4 4 3')
    create_area_line_smooth('area_line_smooth', page, '5 4 4 3')
    create_area_line_groups('area__line_groups', page, '9 4 4 3')
    create_area_negative('area_negative', page, '1 7 4 3')
    create_area_stacked('area_stacked', page, '5 7 4 3')
    create_area_range('area_range', page, '9 7 4 3')

    page.sync()


def create_interval_page(site: Site):
    page = site['/vis/interval']
    page.drop()

    create_interval('interval', page, '1 1 4 3')
    create_interval_range('interval_range', page, '5 1 4 3')
    create_histogram('histogram', page, '9 1 4 3')
    create_interval_groups('interval_groups', page, '1 4 4 3')
    create_interval_stacked('interval_stacked', page, '5 4 4 3')
    create_interval_stacked_grouped('interval_stacked_grouped', page, '9 4 4 3')
    create_interval_helix('interval_helix', page, '1 7 3 4')
    create_interval_polar('interval_polar', page, '4 7 3 4')
    create_interval_theta('interval_theta', page, '7 7 3 4')
    create_interval_polar_stacked('interval_polar_stacked', page, '10 7 3 4')

    page.sync()


def create_polygon_page(site: Site):
    page = site['/vis/polygon']
    page.drop()

    create_polygon('polygon', page, '1 1 6 5')
    create_point_map('point_map', page, '7 1 6 5')

    page.sync()


def create_label_page(site: Site):
    page = site['/vis/label']
    page.drop()

    create_line_labels('labels', page, '1 1 6 5')
    create_line_labels_stroked('stroked', page, '7 1 6 5')
    create_line_labels_no_overlap('no_overlap', page, '1 6 6 5')
    create_interval_labels('custom', page, '7 6 6 5')

    page.sync()


def create_annotation_page(site: Site):
    page = site['/vis/annotation']
    page.drop()

    create_point_annotation('point', page, '1 1 6 10')
    create_line_annotation('line', page, '7 1 6 5')
    create_interval_annotation('interval', page, '7 6 6 5')

    page.sync()


def create_pixel_art_page(site: Site):
    page = site['/pixel_art']
    page.drop()

    v = page.add('pixel_art1', dict(
        view='pixel_art',
        box='1 1 4 6',
        title='Art',
        data=data('color', 16 * 16),
    ))
    page.sync()


def create_site(site: Site):
    create_point_page(site)
    create_line_page(site)
    create_area_page(site)
    create_interval_page(site)
    create_polygon_page(site)
    create_label_page(site)
    create_annotation_page(site)
    create_pixel_art_page(site)


def main():
    site = Site('localhost', 55555, 'admin', 'admin')
    create_site(site)
    # while True:
    #     time.sleep(0.5)
    #     create_site(site)


main()
