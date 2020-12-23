# Stat / Series / Wide / Area
# Create a wide stat card displaying a primary value, an auxiliary value and a series plot.
# ---
import pandas as pd
import time
from h2o_wave import site, ui, data

donut_prices = pd.DataFrame([
    ('2010-01-02', 3.95, 8.5, 5.25, 4.75, 2.86),
    ('2010-01-03', 7.83, 6.25, 8.50, 2.79, 4.93),
    ('2010-01-04', 3.33, 4.75, 6.5, 3.27, 3.16),
    ('2010-01-05', 4.45, 4.50, 4.50, 3.62, 5.90),
    ('2010-01-06', 5.41, 3.70, 3.54, 3.75, 4.51),
    ('2010-01-07', 6.0, 2.25, 3.5, 4.08, 5.16),
    ('2010-01-08', 7.20, 7.125, 4.70, 5.0, 3.97),
    ('2010-01-09', 8.5, 6.33, 5.125, 6.04, 4.29),
    ('2010-01-10', 5.25, 5.95, 5.75, 6.5, 6.41),
    ('2010-01-11', 24.0, 20.70, 7.70, 7.33, 6.68), ],
    columns=['date', 'Cream', 'Cake', 'Cruller', 'Frosted', 'Blueberry'])

donut_prices.set_index('date', inplace=True)


def next_time_series_value(column, point):
    return (donut_prices[column][point]).item(), (donut_prices[column][point] / 100).item()


def next_data_row_index():
    i = 0
    while True:
        yield i % donut_prices.index.size
        i += 1


page = site['/demo']

colors = '$red $pink $blue $azure $cyan $teal $mint $green $lime $yellow $amber $orange $tangerine'.split()
columns = donut_prices.columns
data_row_index = next_data_row_index()
cards = []
for index, column in enumerate(columns):
    val, pc = next_time_series_value(column, index)
    stat_card = page.add(f'example{index}', ui.wide_series_stat_card(
        box=f'1 {index + 1} 2 1',
        title=column,
        value='=${{intl qux minimum_fraction_digits=2 maximum_fraction_digits=2}}',
        aux_value='={{intl quux style="percent" minimum_fraction_digits=1 maximum_fraction_digits=1}}',
        data=dict(qux=val, quux=pc),
        plot_category='foo',
        plot_type='area',
        plot_value='qux',
        plot_color=colors[index],
        plot_data=data('foo qux', -15),
        plot_zero_value=0,
        plot_curve=columns[index],
    ))
    cards.append((column, stat_card))
page.save()

while True:
    time.sleep(1)
    row = next(data_row_index)
    for column, stat_card in (cards):
        val, pc = next_time_series_value(column, row)
        stat_card.data.qux = val
        stat_card.data.quux = pc
        stat_card.plot_data[-1] = [column, val]
    page.save()
