# Stat / Series / Wide / Area
# Create a wide stat card displaying a primary value, an auxiliary value and a series plot.
# ---
import time
from h2o_wave import site, ui, data

daily_donut_prices = [
    ('2010-01-02', 3.95, 8.5, 5.25, 4.75, 2.86),
    ('2010-01-03', 7.83, 6.25, 8.50, 2.79, 4.93),
    ('2010-01-04', 3.33, 4.75, 6.5, 3.27, 3.16),
    ('2010-01-05', 4.45, 4.50, 4.50, 3.62, 5.90),
    ('2010-01-06', 5.41, 3.70, 3.54, 3.75, 4.51),
    ('2010-01-07', 6.0, 2.25, 3.5, 4.08, 5.16),
    ('2010-01-08', 7.20, 7.125, 4.70, 5.0, 3.97),
    ('2010-01-09', 8.5, 6.33, 5.125, 6.04, 4.29),
    ('2010-01-10', 5.25, 5.95, 5.75, 6.5, 6.41),
    ('2010-01-11', 24.0, 20.70, 7.70, 7.33, 6.68), ]


def next_time_series_value():
    i = 0
    while True:
        yield (daily_donut_prices[i % len(daily_donut_prices)])[1:]
        i += 1


page = site['/demo']

donuts = ['Cream', 'Cake', 'Cruller', 'Frosted', 'Blueberry']
colors = '$red $pink $blue $azure $cyan $teal $mint $green $lime $yellow $amber $orange $tangerine'.split()
next_price = next_time_series_value()
donut_values = next(next_price)
cards = []

for i in range(len(donut_values)):
    stat_card = page.add(f'example{i}', ui.wide_series_stat_card(
        box=f'1 {i + 1} 2 1',
        title=donuts[i],
        value='=${{intl qux minimum_fraction_digits=2 maximum_fraction_digits=2}}',
        aux_value='={{intl quux style="percent" minimum_fraction_digits=1 maximum_fraction_digits=1}}',
        data=dict(qux=donut_values[i], quux=donut_values[i] / 100),
        plot_category='foo',
        plot_type='area',
        plot_value='qux',
        plot_color=colors[i],
        plot_data=data('foo qux', -15),
        plot_zero_value=0,
        plot_curve=donuts[i],
    ))
    cards.append((donuts[i], stat_card))
page.save()

while True:
    time.sleep(1)
    donut_values = next(next_price)
    for index, (column, stat_card) in enumerate(cards):
        val, pc = donut_values[index], donut_values[index] / 100
        stat_card.data.qux = val
        stat_card.data.quux = pc
        stat_card.plot_data[-1] = [column, val]
    page.save()
