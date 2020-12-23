# Stat / Small
# Create a stat card displaying a single value.
# ---
import time

from h2o_wave import site, ui

index = 0

currency_values = [
    62.54, 9.42, 26.73, 31.44, 52.90, 8.25, 17.12, 20.35, 48.76, 30.14,
]

page = site['/demo']

value = currency_values[index]
c = page.add('example', ui.small_stat_card(
    box='1 1 1 1',
    title='Ethereum',
    value=f'${value:.2f}',
))
page.save()

while True:
    time.sleep(1)
    value = currency_values[index % len(currency_values)]
    c.value = f'${value:.2f}'
    index += 1
    page.save()
