# Stat / Small
# Create a stat card displaying a single value.
# #stat_card
# ---
import time
from h2o_wave import site, ui

prices = [62.54, 9.42, 26.73, 31.44, 52.90, 8.25, 17.12, 20.35, 48.76, 30.14]


def next_price():
    i = 0
    while True:
        yield prices[i % len(prices)]
        i += 1


page = site['/demo']
price = next_price()

stat_card = page.add('example', ui.small_stat_card(
    box='1 1 1 1',
    title='Donut Price',
    value=f'${next(price):.2f}',
))
page.save()

while True:
    time.sleep(1)
    stat_card.value = f'${next(price):.2f}'
    page.save()
