# Dashboard
# Make a #dashboard using a multitude of cards and update them live.
# ---
from faker import Faker
import time
from h2o_wave import site, data, ui
from synth import FakePercent, FakeCategoricalSeries

fake = Faker()

light_theme_colors = '$red $pink $purple $violet $indigo $blue $azure $cyan $teal $mint $green $amber $orange $tangerine'.split()  # noqa: E501
dark_theme_colors = '$red $pink $blue $azure $cyan $teal $mint $green $lime $yellow $amber $orange $tangerine'.split()

_color_index = -1
colors = dark_theme_colors


def next_color():
    global _color_index
    _color_index += 1
    return colors[_color_index % len(colors)]


_curve_index = -1
curves = 'linear smooth step step-after step-before'.split()


def next_curve():
    global _curve_index
    _curve_index += 1
    return curves[_curve_index % len(curves)]


def create_dashboard(update_freq=0.0):
    page = site['/demo']
    simples = []
    for i in range(1, 7):
        f = FakePercent()
        val, pc = f.next()
        c = page.add(f'a{i}', ui.small_stat_card(
            box=f'{i} 1 1 1',
            title=fake.cryptocurrency_name(),
            value=f'${val:.2f}',
        ))
        simples.append((f, c))

    simples_colored = []
    for i in range(1, 7):
        f = FakeCategoricalSeries()
        cat, val, pc = f.next()
        c = page.add(f'aa{i}', ui.small_series_stat_card(
            box=f'{6 + i} 1 1 1',
            title=fake.cryptocurrency_code(),
            value='=${{intl qux minimum_fraction_digits=2 maximum_fraction_digits=2}}',
            data=dict(qux=val, quux=pc / 100),
            plot_category='foo',
            plot_value='qux',
            plot_color=next_color(),
            plot_data=data('foo qux', -15),
            plot_zero_value=0,
            plot_curve=next_curve(),
        ))
        simples_colored.append((f, c))

    lines = []
    for i in range(1, 13, 2):
        f = FakeCategoricalSeries()
        cat, val, pc = f.next()
        c = page.add(f'b{i}', ui.wide_series_stat_card(
            box=f'{i} 2 2 1',
            title=fake.cryptocurrency_name(),
            value='=${{intl qux minimum_fraction_digits=2 maximum_fraction_digits=2}}',
            aux_value='={{intl quux style="percent" minimum_fraction_digits=1 maximum_fraction_digits=1}}',
            data=dict(qux=val, quux=pc / 100),
            plot_category='foo',
            plot_value='qux',
            plot_color=next_color(),
            plot_data=data('foo qux', -15),
            plot_zero_value=0,
            plot_curve=next_curve(),
        ))
        lines.append((f, c))

    bars = []
    for i in range(1, 13, 2):
        f = FakeCategoricalSeries()
        cat, val, pc = f.next()
        c = page.add(f'c{i}', ui.wide_series_stat_card(
            box=f'{i} 3 2 1',
            title=fake.cryptocurrency_name(),
            value='=${{intl qux minimum_fraction_digits=2 maximum_fraction_digits=2}}',
            aux_value='={{intl quux style="percent" minimum_fraction_digits=1 maximum_fraction_digits=1}}',
            data=dict(qux=val, quux=pc),
            plot_type='interval',
            plot_category='foo',
            plot_value='qux',
            plot_color=next_color(),
            plot_data=data('foo qux', -25),
            plot_zero_value=0
        ))
        bars.append((f, c))

    large_pcs = []
    for i in range(1, 13):
        f = FakePercent()
        val, pc = f.next()
        c = page.add(f'd{i}', ui.tall_gauge_stat_card(
            box=f'{i} 4 1 2',
            title=fake.cryptocurrency_name(),
            value='=${{intl foo minimum_fraction_digits=2 maximum_fraction_digits=2}}',
            aux_value='={{intl bar style="percent" minimum_fraction_digits=2 maximum_fraction_digits=2}}',
            plot_color=next_color(),
            progress=pc,
            data=dict(foo=val, bar=pc / 100),
        ))
        large_pcs.append((f, c))

    large_lines = []
    for i in range(1, 13):
        f = FakeCategoricalSeries()
        cat, val, pc = f.next()
        c = page.add(f'e{i}', ui.tall_series_stat_card(
            box=f'{i} 6 1 2',
            title=fake.cryptocurrency_name(),
            value='=${{intl qux minimum_fraction_digits=2 maximum_fraction_digits=2}}',
            aux_value='={{intl quux style="percent" minimum_fraction_digits=1 maximum_fraction_digits=1}}',
            data=dict(qux=val, quux=pc),
            plot_type='area',
            plot_category='foo',
            plot_value='qux',
            plot_color=next_color(),
            plot_data=data('foo qux', -15),
            plot_zero_value=0,
            plot_curve=next_curve(),
        ))
        large_lines.append((f, c))

    small_pcs = []
    for i in range(1, 7, 2):
        f = FakePercent()
        val, pc = f.next()
        c = page.add(f'f{i}', ui.wide_gauge_stat_card(
            box=f'{i} 8 2 1',
            title=fake.cryptocurrency_name(),
            value='=${{intl foo minimum_fraction_digits=2 maximum_fraction_digits=2}}',
            aux_value='={{intl bar style="percent" minimum_fraction_digits=2 maximum_fraction_digits=2}}',
            plot_color=next_color(),
            progress=pc,
            data=dict(foo=val, bar=pc / 100),
        ))
        small_pcs.append((f, c))

    small_pbs = []
    for i in range(7, 13, 2):
        f = FakePercent()
        val, pc = f.next()
        c = page.add(f'f{i}', ui.wide_bar_stat_card(
            box=f'{i} 8 2 1',
            title=fake.cryptocurrency_name(),
            value='=${{intl foo minimum_fraction_digits=2 maximum_fraction_digits=2}}',
            aux_value='={{intl bar style="percent" minimum_fraction_digits=2 maximum_fraction_digits=2}}',
            plot_color=next_color(),
            progress=pc,
            data=dict(foo=val, bar=pc / 100),
        ))
        small_pbs.append((f, c))

    large_cards = []
    for i in range(1, 7, 2):
        f = FakePercent()
        val, pc = f.next()
        c = page.add(f'g{i}', ui.large_stat_card(
            box=f'{i} 9 2 2',
            title=fake.cryptocurrency_name(),
            value='=${{intl qux minimum_fraction_digits=2 maximum_fraction_digits=2}}',
            aux_value='={{intl quux style="percent" minimum_fraction_digits=1 maximum_fraction_digits=1}}',
            data=dict(qux=val, quux=pc / 100),
            caption=' '.join(fake.sentences()),
        ))
        large_cards.append((f, c))

    large_pbs = []
    for i in range(7, 13, 2):
        f = FakePercent()
        val, pc = f.next()
        c = page.add(f'g{i}', ui.large_bar_stat_card(
            box=f'{i} 9 2 2',
            title=fake.cryptocurrency_name(),
            value='=${{intl foo minimum_fraction_digits=2 maximum_fraction_digits=2}}',
            value_caption='This Month',
            aux_value='={{intl bar style="percent" minimum_fraction_digits=2 maximum_fraction_digits=2}}',
            aux_value_caption='Previous Month',
            plot_color=next_color(),
            progress=pc,
            data=dict(foo=val, bar=pc / 100),
            caption=' '.join(fake.sentences(2)),
        ))
        large_pbs.append((f, c))

    page.save()

    while update_freq > 0:
        time.sleep(update_freq)

        for f, c in simples:
            val, pc = f.next()
            c.value = f'${val:.2f}',

        for f, c in simples_colored:
            cat, val, pc = f.next()
            c.data.qux = val
            c.data.quux = pc / 100
            c.plot_data[-1] = [cat, val]

        for f, c in lines:
            cat, val, pc = f.next()
            c.data.qux = val
            c.data.quux = pc / 100
            c.plot_data[-1] = [cat, val]

        for f, c in bars:
            cat, val, pc = f.next()
            c.data.qux = val
            c.data.quux = pc / 100
            c.plot_data[-1] = [cat, val]

        for f, c in large_lines:
            cat, val, pc = f.next()
            c.data.qux = val
            c.data.quux = pc / 100
            c.plot_data[-1] = [cat, val]

        for f, c in large_pcs:
            val, pc = f.next()
            c.data.foo = val
            c.data.bar = pc
            c.progress = pc

        for f, c in small_pcs:
            val, pc = f.next()
            c.data.foo = val
            c.data.bar = pc
            c.progress = pc

        for f, c in small_pbs:
            val, pc = f.next()
            c.data.foo = val
            c.data.bar = pc
            c.progress = pc

        for f, c in large_cards:
            val, pc = f.next()
            c.data.qux = val
            c.data.quux = pc

        for f, c in large_pbs:
            val, pc = f.next()
            c.data.foo = val
            c.data.bar = pc
            c.progress = pc

        page.save()


create_dashboard(update_freq=0.25)
