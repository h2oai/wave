# Dashboard
# Make a dashboard using a multitude of cards and update them live.
# ---
import time
from h2o_wave import site, data, ui

light_theme_colors = '$red $pink $purple $violet $indigo $blue $azure $cyan $teal $mint $green $amber $orange $tangerine'.split()
dark_theme_colors = '$red $pink $blue $azure $cyan $teal $mint $green $lime $yellow $amber $orange $tangerine'.split()

_color_index = -1
colors = dark_theme_colors


def next_color():
    global _color_index
    _color_index += 1
    return colors[_color_index % len(colors)]


_curve_index = -1
curves = 'linear smooth step stepAfter stepBefore'.split()


def next_curve():
    global _curve_index
    _curve_index += 1
    return curves[_curve_index % len(curves)]


daily_donut_prices = [
    ('2010-01-02', 3.95, 8.5, 5.25, 4.75, 2.86, 3.78),
    ('2010-01-03', 7.83, 6.25, 8.50, 2.79, 4.93, 4.26),
    ('2010-01-04', 3.33, 4.75, 6.5, 3.27, 3.16, 3.82),
    ('2010-01-05', 4.45, 4.50, 4.50, 3.62, 5.90, 4.68),
    ('2010-01-06', 5.41, 3.70, 3.54, 3.75, 4.51, 4.15),
    ('2010-01-07', 6.0, 2.25, 3.5, 4.08, 5.16, 4.75),
    ('2010-01-08', 7.20, 7.125, 4.70, 5.0, 3.97, 3.42),
    ('2010-01-09', 8.5, 6.33, 5.125, 6.04, 4.29, 3.96),
    ('2010-01-10', 5.25, 5.95, 5.75, 6.5, 6.41, 6.15),
    ('2010-01-11', 24.0, 20.70, 7.70, 7.33, 6.68, 6.35), ]

donuts = ['Cream', 'Cake', 'Cruller', 'Frosted', 'Blueberry', 'Glazed']


def next_time_series_value():
    i = 0
    while True:
        yield ((daily_donut_prices[i % len(daily_donut_prices)])[1:], i)
        i += 1


def create_dashboard(update_freq=0.0):
    page = site['/demo']

    next_price = next_time_series_value()
    donut_values, sample_count = next(next_price)

    simples = []
    for i in range(len(donut_values)):
        c = page.add(f'a{i}', ui.small_stat_card(
            box=f'{i + 1} 1 1 1',
            title=donuts[i],
            value=f'${donut_values[i]:.2f}',
        ))
        simples.append((donuts[i], c))

    simples_colored = []
    for i in range(len(donut_values)):
        c = page.add(f'aa{i}', ui.small_series_stat_card(
            box=f'{7 + i} 1 1 1',
            title=donuts[i],
            value='=${{intl qux minimum_fraction_digits=2 maximum_fraction_digits=2}}',
            data=dict(qux=donut_values[i], quux=donut_values[i] / 100),
            plot_category='foo',
            plot_value='qux',
            plot_color=next_color(),
            plot_data=data('foo qux', -15),
            plot_zero_value=0,
            plot_curve=next_curve(),
        ))
        simples_colored.append((donuts[i], c))

    lines = []
    for i in range(1, 13, 2):
        c = page.add(f'b{i}', ui.wide_series_stat_card(
            box=f'{i} 2 2 1',
            title=donuts[i // 2],
            value='=${{intl qux minimum_fraction_digits=2 maximum_fraction_digits=2}}',
            aux_value='={{intl quux style="percent" minimum_fraction_digits=1 maximum_fraction_digits=1}}',
            data=dict(qux=donut_values[i // 2], quux=donut_values[i // 2] / 100),
            plot_category='foo',
            plot_value='qux',
            plot_color=next_color(),
            plot_data=data('foo qux', -15),
            plot_zero_value=0,
            plot_curve=next_curve(),
        ))
        lines.append((donuts[i // 2], c))

    bars = []
    for i in range(1, 13, 2):
        c = page.add(f'c{i}', ui.wide_series_stat_card(
            box=f'{i} 3 2 1',
            title=donuts[i // 2],
            value='=${{intl qux minimum_fraction_digits=2 maximum_fraction_digits=2}}',
            aux_value='={{intl quux style="percent" minimum_fraction_digits=1 maximum_fraction_digits=1}}',
            data=dict(qux=donut_values[i // 2], quux=donut_values[i // 2] / 100),
            plot_type='interval',
            plot_category='foo',
            plot_value='qux',
            plot_color=next_color(),
            plot_data=data('foo qux', -25),
            plot_zero_value=0
        ))
        bars.append((donuts[i // 2], c))

    large_pcs = []
    for i in range(len(donut_values)):
        c = page.add(f'd{i}', ui.tall_gauge_stat_card(
            box=f'{i + 1} 4 1 2',
            title=donuts[i],
            value='=${{intl foo minimum_fraction_digits=2 maximum_fraction_digits=2}}',
            aux_value='={{intl bar style="percent" minimum_fraction_digits=2 maximum_fraction_digits=2}}',
            plot_color=next_color(),
            progress=donut_values[i] / 100,
            data=dict(foo=donut_values[i], bar=donut_values[i] / 100),
        ))
        large_pcs.append((donuts[i], c))

    large_lines = []
    for i in range(6, 12):
        c = page.add(f'e{i}', ui.tall_series_stat_card(
            box=f'{i + 1} 4 1 2',
            title=donuts[i % len(donuts)],
            value='=${{intl qux minimum_fraction_digits=2 maximum_fraction_digits=2}}',
            aux_value='={{intl quux style="percent" minimum_fraction_digits=1 maximum_fraction_digits=1}}',
            data=dict(foo=donut_values[i % len(donuts)], bar=donut_values[i % len(donuts)] / 100),
            plot_type='area',
            plot_category='foo',
            plot_value='qux',
            plot_color=next_color(),
            plot_data=data('foo qux', -15),
            plot_zero_value=0,
            plot_curve=next_curve(),
        ))
        large_lines.append((donuts[i % len(donuts)], c))

    small_pcs = []
    for i in range(1, 13, 2):
        c = page.add(f'f{i}', ui.wide_gauge_stat_card(
            box=f'{i} 6 2 1',
            title=donuts[i // 2],
            value='=${{intl foo minimum_fraction_digits=2 maximum_fraction_digits=2}}',
            aux_value='={{intl bar style="percent" minimum_fraction_digits=2 maximum_fraction_digits=2}}',
            plot_color=next_color(),
            progress=donut_values[i // 2],
            data=dict(foo=donut_values[i // 2], bar=donut_values[i // 2] / 100),
        ))
        small_pcs.append((donuts[i // 2], c))

    small_pbs = []
    for i in range(1, 13, 2):
        c = page.add(f'g{i}', ui.wide_bar_stat_card(
            box=f'{i} 7 2 1',
            title=donuts[i // 2],
            value='=${{intl foo minimum_fraction_digits=2 maximum_fraction_digits=2}}',
            aux_value='={{intl bar style="percent" minimum_fraction_digits=2 maximum_fraction_digits=2}}',
            plot_color=next_color(),
            progress=donut_values[i // 2],
            data=dict(foo=donut_values[i // 2], bar=donut_values[i // 2] / 100),
        ))
        small_pbs.append((donuts[i // 2], c))

    large_cards = []
    for i in range(1, 13, 2):
        c = page.add(f'h{i}', ui.large_stat_card(
            box=f'{i} 8 2 2',
            title=donuts[i // 2],
            value='=${{intl qux minimum_fraction_digits=2 maximum_fraction_digits=2}}',
            aux_value='={{intl quux style="percent" minimum_fraction_digits=1 maximum_fraction_digits=1}}',
            data=dict(foo=donut_values[i // 2], bar=donut_values[i // 2] / 100),
            caption='Fluctuations of the donuts price over the time',
        ))
        large_cards.append((donuts[i // 2], c))

    large_pbs = []
    for i in range(1, 13, 2):
        c = page.add(f'i{i}', ui.large_bar_stat_card(
            box=f'{i} 10 2 2',
            title=donuts[i // 2],
            value='=${{intl foo minimum_fraction_digits=2 maximum_fraction_digits=2}}',
            value_caption='This Month',
            aux_value='={{intl bar style="percent" minimum_fraction_digits=2 maximum_fraction_digits=2}}',
            aux_value_caption='Previous Month',
            plot_color=next_color(),
            progress=donut_values[i // 2],
            data=dict(foo=donut_values[i // 2], bar=donut_values[i // 2] / 100),
            caption='Fluctuations of the donuts price over the time',
        ))
        large_pbs.append((donuts[i // 2], c))

    page.save()

    while update_freq > 0:
        time.sleep(update_freq)

        donut_values, sample_count = next(next_price)
        for index, (f, c) in enumerate(simples):
            c.value = f'${donut_values[index]:.2f}',

        for index, (f, c) in enumerate(simples_colored):
            val, pc = donut_values[index], donut_values[index] / 100
            c.data.qux = val
            c.data.quux = pc
            c.plot_data[-1] = [f, val]

        for index, (f, c) in enumerate(lines):
            val, pc = donut_values[index], donut_values[index] / 100
            c.data.qux = val
            c.data.quux = pc
            c.plot_data[-1] = [f, val]

        for index, (f, c) in enumerate(bars):
            val, pc = donut_values[index], donut_values[index] / 100
            c.data.qux = val
            c.data.quux = pc
            c.plot_data[-1] = [sample_count, val]

        for index, (f, c) in enumerate(large_lines):
            val, pc = donut_values[index], donut_values[index] / 100
            c.data.qux = val
            c.data.quux = pc
            c.plot_data[-1] = [sample_count, val]

        for index, (f, c) in enumerate(large_pcs):
            val, pc = donut_values[index], donut_values[index] / 100
            c.data.foo = val
            c.data.bar = pc
            c.progress = pc

        for index, (f, c) in enumerate(small_pcs):
            val, pc = donut_values[index], donut_values[index] / 100
            c.data.foo = val
            c.data.bar = pc
            c.progress = pc

        for index, (f, c) in enumerate(small_pbs):
            val, pc = donut_values[index], donut_values[index] / 100
            c.data.foo = val
            c.data.bar = pc
            c.progress = pc

        for index, (f, c) in enumerate(large_cards):
            val, pc = donut_values[index], donut_values[index] / 100
            c.data.qux = val
            c.data.quux = pc

        for index, (f, c) in enumerate(large_pbs):
            val, pc = donut_values[index], donut_values[index] / 100
            c.data.foo = val
            c.data.bar = pc
            c.progress = pc

        page.save()


create_dashboard(update_freq=0.25)
