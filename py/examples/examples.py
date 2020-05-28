from faker import Faker
import time
import random
from telesync import Site, data, pack
from synth import FakePercent, FakeCategoricalSeries

fake = Faker()

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


def create_widgets_page(site: Site, update_freq=0.0):
    url = '/demo/widgets'
    page = site[url]
    page.drop()

    simples = []
    for i in range(1, 7):
        f = FakePercent()
        val, pc = f.next()
        c = page.add(f'a{i}', dict(
            view='card1',
            box=f'{i} 1 1 1',
            title=fake.cryptocurrency_name(),
            value=f'${val:.2f}',
        ))
        simples.append((f, c))

    simples_colored = []
    for i in range(1, 7):
        f = FakeCategoricalSeries()
        cat, val, pc = f.next()
        c = page.add(f'aa{i}', dict(
            view='card7',
            box=f'{6 + i} 1 1 1',
            title=fake.cryptocurrency_code(),
            value='=${{intl qux minimum_fraction_digits=2 maximum_fraction_digits=2}}',
            data=dict(qux=val, quux=pc),
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
        c = page.add(f'b{i}', dict(
            view='card2',
            box=f'{i} 2 2 1',
            title=fake.cryptocurrency_name(),
            value='=${{intl qux minimum_fraction_digits=2 maximum_fraction_digits=2}}',
            aux_value='={{intl quux style="unit" unit="percent" minimum_fraction_digits=1 maximum_fraction_digits=1}}',
            data=dict(qux=val, quux=pc),
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
        c = page.add(f'c{i}', dict(
            view='card2',
            box=f'{i} 3 2 1',
            title=fake.cryptocurrency_name(),
            value='=${{intl qux minimum_fraction_digits=2 maximum_fraction_digits=2}}',
            aux_value='={{intl quux style="unit" unit="percent" minimum_fraction_digits=1 maximum_fraction_digits=1}}',
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
        c = page.add(f'd{i}', dict(
            view='card5',
            box=f'{i} 4 1 2',
            title=fake.cryptocurrency_name(),
            value='=${{intl foo minimum_fraction_digits=2 maximum_fraction_digits=2}}',
            aux_value='={{intl bar style="unit" unit="percent" minimum_fraction_digits=2 maximum_fraction_digits=2}}',
            plot_color=next_color(),
            progress=pc,
            data=dict(foo=val, bar=pc * 100),
        ))
        large_pcs.append((f, c))

    large_lines = []
    for i in range(1, 13):
        f = FakeCategoricalSeries()
        cat, val, pc = f.next()
        c = page.add(f'e{i}', dict(
            view='card6',
            box=f'{i} 6 1 2',
            title=fake.cryptocurrency_name(),
            value='=${{intl qux minimum_fraction_digits=2 maximum_fraction_digits=2}}',
            aux_value='={{intl quux style="unit" unit="percent" minimum_fraction_digits=1 maximum_fraction_digits=1}}',
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
        c = page.add(f'f{i}', dict(
            view='card4',
            box=f'{i} 8 2 1',
            title=fake.cryptocurrency_name(),
            value='=${{intl foo minimum_fraction_digits=2 maximum_fraction_digits=2}}',
            aux_value='={{intl bar style="unit" unit="percent" minimum_fraction_digits=2 maximum_fraction_digits=2}}',
            plot_color=next_color(),
            progress=pc,
            data=dict(foo=val, bar=pc * 100),
        ))
        small_pcs.append((f, c))

    small_pbs = []
    for i in range(7, 13, 2):
        f = FakePercent()
        val, pc = f.next()
        c = page.add(f'f{i}', dict(
            view='card8',
            box=f'{i} 8 2 1',
            title=fake.cryptocurrency_name(),
            value='=${{intl foo minimum_fraction_digits=2 maximum_fraction_digits=2}}',
            aux_value='={{intl bar style="unit" unit="percent" minimum_fraction_digits=2 maximum_fraction_digits=2}}',
            plot_color=next_color(),
            progress=pc,
            data=dict(foo=val, bar=pc * 100),
        ))
        small_pbs.append((f, c))

    large_cards = []
    for i in range(1, 7, 2):
        f = FakePercent()
        val, pc = f.next()
        c = page.add(f'g{i}', dict(
            fields=('foo', 'bar'),
            view='card3',
            box=f'{i} 9 2 2',
            title=fake.cryptocurrency_name(),
            value='=${{intl qux minimum_fraction_digits=2 maximum_fraction_digits=2}}',
            aux_value='={{intl quux style="unit" unit="percent" minimum_fraction_digits=1 maximum_fraction_digits=1}}',
            data=dict(qux=val, quux=pc * 100),
            caption=' '.join(fake.sentences()),
        ))
        large_cards.append((f, c))

    large_pbs = []
    for i in range(7, 13, 2):
        f = FakePercent()
        val, pc = f.next()
        c = page.add(f'g{i}', dict(
            view='card9',
            box=f'{i} 9 2 2',
            title=fake.cryptocurrency_name(),
            value='=${{intl foo minimum_fraction_digits=2 maximum_fraction_digits=2}}',
            value_caption='This Month',
            aux_value='={{intl bar style="unit" unit="percent" minimum_fraction_digits=2 maximum_fraction_digits=2}}',
            aux_value_caption='Previous Month',
            plot_color=next_color(),
            progress=pc,
            data=dict(foo=val, bar=pc * 100),
            caption=' '.join(fake.sentences(2)),
        ))
        large_pbs.append((f, c))

    page.sync()

    while update_freq > 0:
        time.sleep(update_freq)

        for f, c in simples:
            val, pc = f.next()
            c.value = f'${val:.2f}',

        for f, c in simples_colored:
            cat, val, pc = f.next()
            c.data.qux = val
            c.data.quux = pc
            c.plot_data[-1] = [cat, val]

        for f, c in lines:
            cat, val, pc = f.next()
            c.data.qux = val
            c.data.quux = pc
            c.plot_data[-1] = [cat, val]

        for f, c in bars:
            cat, val, pc = f.next()
            c.data.qux = val
            c.data.quux = pc
            c.plot_data[-1] = [cat, val]

        for f, c in large_lines:
            cat, val, pc = f.next()
            c.data.qux = val
            c.data.quux = pc
            c.plot_data[-1] = [cat, val]

        for f, c in large_pcs:
            val, pc = f.next()
            c.data.foo = val
            c.data.bar = pc * 100
            c.progress = pc

        for f, c in small_pcs:
            val, pc = f.next()
            c.data.foo = val
            c.data.bar = pc * 100
            c.progress = pc

        for f, c in small_pbs:
            val, pc = f.next()
            c.data.foo = val
            c.data.bar = pc * 100
            c.progress = pc

        for f, c in large_cards:
            val, pc = f.next()
            c.data.qux = val
            c.data.quux = pc * 100

        for f, c in large_pbs:
            val, pc = f.next()
            c.data.foo = val
            c.data.bar = pc * 100
            c.progress = pc

        page.sync()


def create_template_page(site: Site, update_freq=0.0):
    url = '/demo/template'
    page = site[url]
    page.drop()
    c = page.add('template_example', dict(
        view='template',
        box=f'1 1 12 10',
        # title='Template Example',
        content='{{product}} costs {{price}}!',
        data=pack(dict(product='Coffee', price='$3.45')),
    ))
    page.sync()


def create_lists_page(site: Site, update_freq=0.0):
    url = '/demo/lists'
    page = site[url]
    page.drop()

    # list
    c = page.add('basic_list', dict(
        box='1 1 2 4',
        view='basic_list',
        item_view='list_item1',
        item_props=pack(dict(title='=code', caption='=currency', value='=trades', aux_value='=returns')),
        title='Exchange Rates',
        data=data('currency code trades returns', -15),
    ))
    c.data = [
        [fake.cryptocurrency_name(), fake.cryptocurrency_code(), random.randint(100, 1000), random.randint(10, 100)] for
        i in range(15)]

    # simple repeater
    c = page.add('repeat', dict(
        box='3 1 2 4',
        view='repeat',
        item_view='list_item1',
        item_props=pack(dict(title='=code', caption='=currency', value='=trades', aux_value='=returns')),
        data=data('currency code trades returns', -15),
    ))
    c.data = [
        [fake.cryptocurrency_name(), fake.cryptocurrency_code(), random.randint(100, 1000), random.randint(10, 100)] for
        i in range(15)]

    # flex layout
    c = page.add('flex', dict(
        box='5 1 1 1',
        view='flex',
        direction='horizontal',
        justify='between',
        wrap='between',
        item_view='template',
        item_props=pack(dict(
            template='<div style="width:15px; height:15px; border-radius: 50%; background-color:{{#if loss}}red{{else}}green{{/if}}" title="{{code}}"/>'
        )),
        data=data('code loss', -10),
    ))
    c.data = [[fake.cryptocurrency_code(), random.randint(0, 1)] for i in range(10)]

    # table
    c = page.add('table', dict(
        box='6 1 3 4',
        title='Currency Trades',
        view='grid',
        cells=pack([
            dict(title='Currency', value='=currency'),
            dict(title='Trades',
                 view='list_item1',
                 props=dict(title='=code', caption='1 hour ago', value='=trades', aux_value='=returns')),
        ]),
        data=data('currency code trades returns', -15),
    ))
    c.data = [
        [fake.cryptocurrency_name(), fake.cryptocurrency_code(), random.randint(100, 1000), random.randint(10, 100)] for
        i in range(15)]

    page.sync()


def create_site(site: Site):
    create_template_page(site)
    create_lists_page(site)
    create_widgets_page(site, update_freq=0.25)


create_site(Site())
