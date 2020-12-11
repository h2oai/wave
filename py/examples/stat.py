# Stat Cards
# ---
import time

from h2o_wave import site, ui, data
from faker import Faker

from synth import FakeCategoricalSeries
from synth import FakePercent

page = site['/demo']

mock_description = 'Your description goes here'

fakePercent = FakePercent()
fakeSeries = FakeCategoricalSeries()

val, percentage = fakePercent.next()
category_series, val_series, percentage_series = fakeSeries.next()

# Stat cards
page.add('large_stat_card', ui.large_stat_card(
    box='1 1 2 2',
    title="Large Stat Card",
    value='={{intl value minimum_fraction_digits=2 maximum_fraction_digits=2}}',
    aux_value='={{intl aux_value style="percent" minimum_fraction_digits=1 maximum_fraction_digits=1}}',
    data=dict(value=val, aux_value=percentage),
    caption=mock_description,
))

page.add('small_stat_card', ui.small_stat_card(
    box='3 1 1 1',
    title='Small Stat Card',
    value=f'${val:.2f}',
))

# Gauges
page.add('tall_gauge_stat_card', ui.tall_gauge_stat_card(
    box='1 3 1 2',
    title='Tall Gauge',
    value='=${{intl value minimum_fraction_digits=2 maximum_fraction_digits=2}}',
    aux_value='={{intl aux_value style="percent" minimum_fraction_digits=2 maximum_fraction_digits=2}}',
    plot_color='$red',
    progress=percentage,
    data=dict(value=val, aux_value=percentage),
))

page.add('wide_gauge_stat_card', ui.wide_gauge_stat_card(
    box='2 3 2 1',
    title='Wide Gauge',
    value='=${{intl value minimum_fraction_digits=2 maximum_fraction_digits=2}}',
    aux_value='={{intl aux_value style="percent" minimum_fraction_digits=2 maximum_fraction_digits=2}}',
    plot_color='$red',
    progress=percentage,
    data=dict(value=val, aux_value=percentage),
))

# Bar cards
page.add('large_bar_stat_card', ui.large_bar_stat_card(
    box='1 5 2 2',
    title='Large Bar',
    value='=${{intl value minimum_fraction_digits=2 maximum_fraction_digits=2}}',
    value_caption='This Month',
    aux_value='={{intl aux_value style="percent" minimum_fraction_digits=2 maximum_fraction_digits=2}}',
    aux_value_caption='Previous Month',
    plot_color='$red',
    progress=percentage,
    data=dict(value=val, aux_value=percentage),
    caption=mock_description,
))

page.add('wide_bar_stat_card', ui.wide_bar_stat_card(
    box='3 5 2 1',
    title='Wide Bar',
    value='=${{intl value minimum_fraction_digits=2 maximum_fraction_digits=2}}',
    aux_value='={{intl aux_value style="percent" minimum_fraction_digits=2 maximum_fraction_digits=2}}',
    plot_color='$red',
    progress=percentage,
    data=dict(value=val, aux_value=percentage),
))

# Time series data cards
colors = '$red $pink $blue $azure $cyan $teal $mint $green $lime $yellow $amber $orange $tangerine'.split()
curves = 'linear smooth step step-after step-before'.split()
for i in range(len(curves)):
    page.add(f'small_series_stat_card_area_{i}', ui.small_series_stat_card(
        box=f'{i + 1} 7 1 1',
        title="Series",
        value='=${{intl value minimum_fraction_digits=2 maximum_fraction_digits=2}}',
        data=dict(value=val_series, aux_value=percentage_series),
        plot_category='category',
        plot_type='area',
        plot_value='value',
        plot_color=colors[i],
        plot_data=data('category value', -15),
        plot_zero_value=0,
        plot_curve=curves[i],
    ))

page.add('small_series_stat_card_interval', ui.small_series_stat_card(
    box='1 8 1 1',
    title='Series',
    value='=${{intl value minimum_fraction_digits=2 maximum_fraction_digits=2}}',
    data=dict(value=val_series, aux_value=percentage_series),
    plot_category='category',
    plot_type='interval',
    plot_value='value',
    plot_color='$red',
    plot_data=data('category value', -20),
    plot_zero_value=0,
))

for i in range(len(curves)):
    page.add(f'wide_series_stat_card_area_{i}', ui.wide_series_stat_card(
        box=f'{1 + 2*i} 9 2 1',
        title='Wide Series Area',
        value='=${{intl value minimum_fraction_digits=2 maximum_fraction_digits=2}}',
        aux_value='={{intl aux_value style="percent" minimum_fraction_digits=1 maximum_fraction_digits=1}}',
        data=dict(value=val_series, aux_value=percentage_series / 100),
        plot_category='category',
        plot_type='area',
        plot_value='value',
        plot_color=colors[i],
        plot_data=data('category value', -15),
        plot_zero_value=0,
        plot_curve=curves[i],
    ))

page.add('wide_series_stat_card_interval', ui.wide_series_stat_card(
    box='1 10 2 1',
    title='Wide Series Interval',
    value='=${{intl value minimum_fraction_digits=2 maximum_fraction_digits=2}}',
    aux_value='={{intl aux_value style="percent" minimum_fraction_digits=1 maximum_fraction_digits=1}}',
    data=dict(value=val, aux_value=percentage / 100),
    plot_category='category',
    plot_type='interval',
    plot_value='value',
    plot_color='$red',
    plot_data=data('category value', -15),
    plot_zero_value=0,
))

for i in range(len(curves)):
    f = FakeCategoricalSeries()
    page.add(f'tall_series_stat_card_area_{i}', ui.tall_series_stat_card(
        box=f'{i + 1} 11 1 2',
        title='Tall Series',
        value='=${{intl value minimum_fraction_digits=2 maximum_fraction_digits=2}}',
        aux_value='={{intl aux_value style="percent" minimum_fraction_digits=1 maximum_fraction_digits=1}}',
        data=dict(value=val_series, aux_value=percentage_series / 100),
        plot_type='area',
        plot_category='category',
        plot_value='value',
        plot_color=colors[i],
        plot_data=data('category value', -15),
        plot_zero_value=0,
        plot_curve=curves[i],
    ))

page.add('tall_series_stat_card', ui.tall_series_stat_card(
    box='1 13 1 2',
    title='Tall Series',
    value='=${{intl value minimum_fraction_digits=2 maximum_fraction_digits=2}}',
    aux_value='={{intl aux_value style="percent" minimum_fraction_digits=1 maximum_fraction_digits=1}}',
    data=dict(value=val_series, aux_value=percentage_series / 100),
    plot_category='category',
    plot_type='interval',
    plot_value='value',
    plot_color='$red',
    plot_data=data('category value', -20),
    plot_zero_value=0,
))

page.save()

while True:
    time.sleep(1)

    val, percentage = fakePercent.next()
    c = page['large_stat_card']
    c.data.value = val
    c.data.aux_value = percentage

    val, _ = fakePercent.next()
    c = page['small_stat_card']
    c.value = f'${val:.2f}'

    val, percentage = fakePercent.next()
    c = page['wide_gauge_stat_card']
    c.data.value = val
    c.data.aux_value = percentage
    c.progress = percentage

    val, percentage = fakePercent.next()
    c = page['tall_gauge_stat_card']
    c.data.value = val
    c.data.aux_value = percentage
    c.progress = percentage

    val, percentage = fakePercent.next()
    c = page['wide_bar_stat_card']
    c.data.value = val
    c.data.aux_value = percentage
    c.progress = percentage

    val, percentage = fakePercent.next()
    c = page['large_bar_stat_card']
    c.data.value = val
    c.data.aux_value = percentage
    c.progress = percentage

    for i in range(len(curves)):
        category_series, val_series, percentage_series = fakeSeries.next()
        c = page[f'small_series_stat_card_area_{i}']
        c.data.value = val_series
        c.data.aux_value = percentage_series
        c.plot_data[-1] = [category_series, val_series]

    category_series, val_series, percentage_series = fakeSeries.next()
    c = page['small_series_stat_card_interval']
    c.data.value = val_series
    c.data.aux_value = percentage_series
    c.plot_data[-1] = [category_series, val_series]

    for i in range(len(curves)):
        category_series, val_series, percentage_series = fakeSeries.next()
        c = page[f'wide_series_stat_card_area_{i}']
        c.data.value = val_series
        c.data.aux_value = percentage_series / 100
        c.plot_data[-1] = [category_series, val_series]

    category_series, val_series, percentage_series = fakeSeries.next()
    c = page['wide_series_stat_card_interval']
    c.data.value = val_series
    c.data.aux_value = percentage_series / 100
    c.plot_data[-1] = [category_series, val_series]

    for i in range(len(curves)):
        category_series, val_series, percentage_series = fakeSeries.next()
        c = page[f'tall_series_stat_card_area_{i}']
        c.data.value = val_series
        c.data.aux_value = percentage_series / 100
        c.plot_data[-1] = [category_series, val_series]

    category_series, val_series, percentage_series = fakeSeries.next()
    c = page['tall_series_stat_card']
    c.data.value = val_series
    c.data.aux_value = percentage_series / 100
    c.plot_data[-1] = [category_series, val_series]

    page.save()
