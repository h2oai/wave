# Stat Cards
# ---
import time

from h2o_wave import site, ui, data
from faker import Faker

from synth import FakeCategoricalSeries
from synth import FakePercent

page = site['/demo']

faker = Faker()
fakePercent = FakePercent()
fakeSeries = FakeCategoricalSeries()
val, pc = fakePercent.next()
cat_s, val_s, pc_s = fakeSeries.next()

page.add('small_stat_card', ui.small_stat_card(
    box='1 1 1 1',
    title='Small Stat Card',
    value=f'${val:.2f}',
))

page.add('large_stat_card', ui.large_stat_card(
    box='2 1 2 2',
    title="Large Stat Card",
    value='=${{intl qux minimum_fraction_digits=2 maximum_fraction_digits=2}}',
    aux_value='={{intl quux style="percent" minimum_fraction_digits=1 maximum_fraction_digits=1}}',
    data=dict(qux=val, quux=pc),
    caption=' '.join(faker.sentences()),
))

page.add('wide_gauge_stat_card', ui.wide_gauge_stat_card(
    box='1 3 2 1',
    title='Wide Gauge',
    value='=${{intl foo minimum_fraction_digits=2 maximum_fraction_digits=2}}',
    aux_value='={{intl bar style="percent" minimum_fraction_digits=2 maximum_fraction_digits=2}}',
    plot_color='$red',
    progress=pc,
    data=dict(foo=val, bar=pc),
))

page.add('tall_gauge_stat_card', ui.tall_gauge_stat_card(
    box='3 3 1 2',
    title='Tall Gauge',
    value='=${{intl foo minimum_fraction_digits=2 maximum_fraction_digits=2}}',
    aux_value='={{intl bar style="percent" minimum_fraction_digits=2 maximum_fraction_digits=2}}',
    plot_color='$red',
    progress=pc,
    data=dict(foo=val, bar=pc),
))

page.add('wide_bar_stat_card', ui.wide_bar_stat_card(
    box='1 5 2 1',
    title='Wide Bar',
    value='=${{intl foo minimum_fraction_digits=2 maximum_fraction_digits=2}}',
    aux_value='={{intl bar style="percent" minimum_fraction_digits=2 maximum_fraction_digits=2}}',
    plot_color='$red',
    progress=pc,
    data=dict(foo=val, bar=pc),
))

page.add('large_bar_stat_card', ui.large_bar_stat_card(
    box='3 5 2 2',
    title='Large Bar',
    value='=${{intl foo minimum_fraction_digits=2 maximum_fraction_digits=2}}',
    value_caption='This Month',
    aux_value='={{intl bar style="percent" minimum_fraction_digits=2 maximum_fraction_digits=2}}',
    aux_value_caption='Previous Month',
    plot_color='$red',
    progress=pc,
    data=dict(foo=val, bar=pc),
    caption=' '.join(faker.sentences(2)),
))

colors = '$red $pink $blue $azure $cyan $teal $mint $green $lime $yellow $amber $orange $tangerine'.split()
curves = 'linear smooth step step-after step-before'.split()
for i in range(len(curves)):
    page.add(f'small_series_stat_card_area_{i}', ui.small_series_stat_card(
        box=f'{i + 1} 7 1 1',
        title="Series",
        value='=${{intl qux minimum_fraction_digits=2 maximum_fraction_digits=2}}',
        data=dict(qux=val_s, quux=pc_s),
        plot_category='foo',
        plot_type='area',
        plot_value='qux',
        plot_color=colors[i],
        plot_data=data('foo qux', -15),
        plot_zero_value=0,
        plot_curve=curves[i],
    ))

page.add('small_series_stat_card_interval', ui.small_series_stat_card(
    box='1 8 1 1',
    title='Series',
    value='=${{intl qux minimum_fraction_digits=2 maximum_fraction_digits=2}}',
    data=dict(qux=val_s, quux=pc_s),
    plot_category='foo',
    plot_type='interval',
    plot_value='qux',
    plot_color='$red',
    plot_data=data('foo qux', -20),
    plot_zero_value=0,
))

for i in range(len(curves)):
    page.add(f'wide_series_stat_card_area_{i}', ui.wide_series_stat_card(
        box=f'{1 + 2*i} 9 2 1',
        title='Wide Series Area',
        value='=${{intl qux minimum_fraction_digits=2 maximum_fraction_digits=2}}',
        aux_value='={{intl quux style="percent" minimum_fraction_digits=1 maximum_fraction_digits=1}}',
        data=dict(qux=val_s, quux=pc_s / 100),
        plot_category='foo',
        plot_type='area',
        plot_value='qux',
        plot_color=colors[i],
        plot_data=data('foo qux', -15),
        plot_zero_value=0,
        plot_curve=curves[i],
    ))

page.add('wide_series_stat_card_interval', ui.wide_series_stat_card(
    box='1 10 2 1',
    title='Wide Series Interval',
    value='=${{intl qux minimum_fraction_digits=2 maximum_fraction_digits=2}}',
    aux_value='={{intl quux style="percent" minimum_fraction_digits=1 maximum_fraction_digits=1}}',
    data=dict(qux=val, quux=pc / 100),
    plot_category='foo',
    plot_type='interval',
    plot_value='qux',
    plot_color='$red',
    plot_data=data('foo qux', -15),
    plot_zero_value=0,
))

for i in range(len(curves)):
    f = FakeCategoricalSeries()
    page.add(f'tall_series_stat_card_area_{i}', ui.tall_series_stat_card(
        box=f'{i + 1} 11 1 2',
        title='Tall Series',
        value='=${{intl qux minimum_fraction_digits=2 maximum_fraction_digits=2}}',
        aux_value='={{intl quux style="percent" minimum_fraction_digits=1 maximum_fraction_digits=1}}',
        data=dict(qux=val_s, quux=pc_s / 100),
        plot_type='area',
        plot_category='foo',
        plot_value='qux',
        plot_color=colors[i],
        plot_data=data('foo qux', -15),
        plot_zero_value=0,
        plot_curve=curves[i],
    ))

page.add('tall_series_stat_card', ui.tall_series_stat_card(
    box='1 13 1 2',
    title='Tall Series',
    value='=${{intl qux minimum_fraction_digits=2 maximum_fraction_digits=2}}',
    aux_value='={{intl quux style="percent" minimum_fraction_digits=1 maximum_fraction_digits=1}}',
    data=dict(qux=val_s, quux=pc_s / 100),
    plot_category='foo',
    plot_type='interval',
    plot_value='qux',
    plot_color='$red',
    plot_data=data('foo qux', -20),
    plot_zero_value=0,
))

page.save()

while True:
    time.sleep(1)

    val, _ = fakePercent.next()
    c = page['small_stat_card']
    c.value = f'${val:.2f}'

    val, pc = fakePercent.next()
    c = page['large_stat_card']
    c.data.qux = val
    c.data.quux = pc

    val, pc = fakePercent.next()
    c = page['wide_gauge_stat_card']
    c.data.foo = val
    c.data.bar = pc
    c.progress = pc

    val, pc = fakePercent.next()
    c = page['tall_gauge_stat_card']
    c.data.foo = val
    c.data.bar = pc
    c.progress = pc

    val, pc = fakePercent.next()
    c = page['wide_bar_stat_card']
    c.data.foo = val
    c.data.bar = pc
    c.progress = pc

    val, pc = fakePercent.next()
    c = page['large_bar_stat_card']
    c.data.foo = val
    c.data.bar = pc
    c.progress = pc

    for i in range(len(curves)):
        cat_s, val_s, pc_s = fakeSeries.next()
        c = page[f'small_series_stat_card_area_{i}']
        c.data.qux = val_s
        c.data.quux = pc_s
        c.plot_data[-1] = [cat_s, val_s]

    cat_s, val_s, pc_s = fakeSeries.next()
    c = page['small_series_stat_card_interval']
    c.data.qux = val_s
    c.data.quux = pc_s
    c.plot_data[-1] = [cat_s, val_s]

    for i in range(len(curves)):
        cat_s, val_s, pc_s = fakeSeries.next()
        c = page[f'wide_series_stat_card_area_{i}']
        c.data.qux = val_s
        c.data.quux = pc_s / 100
        c.plot_data[-1] = [cat_s, val_s]

    cat_s, val_s, pc_s = fakeSeries.next()
    c = page['wide_series_stat_card_interval']
    c.data.qux = val_s
    c.data.quux = pc_s / 100
    c.plot_data[-1] = [cat_s, val_s]

    for i in range(len(curves)):
        cat_s, val_s, pc_s = fakeSeries.next()
        c = page[f'tall_series_stat_card_area_{i}']
        c.data.qux = val_s
        c.data.quux = pc_s / 100
        c.plot_data[-1] = [cat_s, val_s]

    cat_s, val_s, pc_s = fakeSeries.next()
    c = page['tall_series_stat_card']
    c.data.qux = val_s
    c.data.quux = pc_s / 100
    c.plot_data[-1] = [cat_s, val_s]

    page.save()
