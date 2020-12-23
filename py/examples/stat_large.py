# Stat / Large
# Create a stat card displaying a primary value, an auxiliary value and a caption.
# ---
import time
from h2o_wave import site, ui

price_changes = [(62.54, 0.2345), (9.42, 0.4033), (26.73, 0.3065), (31.44, 0.10000), (52.90, 0.482),
                 (8.25, 0.2650), (17.12, 0.0328), (20.35, 0.4638), (48.76, 0.3756), (30.14, 0.1500), ]


def next_price_fluctuation():
    i = 0
    while True:
        yield price_changes[i % len(price_changes)]
        i += 1


page = site['/demo']
price_change = next_price_fluctuation()
price, pc = next(price_change)

stat_card = page.add(f'example', ui.large_stat_card(
    box='1 1 2 2',
    title='Donut price fluctuations',
    value='=${{intl qux minimum_fraction_digits=2 maximum_fraction_digits=2}}',
    aux_value='={{intl quux style="percent" minimum_fraction_digits=1 maximum_fraction_digits=1}}',
    data=dict(qux=price, quux=pc),
    caption='Fluctuations of the donuts price over the time'
))
page.save()

while True:
    time.sleep(1)
    price, pc = next(price_change)
    stat_card.data.qux = price
    stat_card.data.quux = pc
    page.save()
