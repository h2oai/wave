# Stat / Bar / Large
# Create a large captioned card displaying a primary value, an auxiliary value and a progress bar, with captions for each value.
# ---
import time

from faker import Faker

from synth import FakePercent
from telesync import site, ui

page = site['/demo']

fake = Faker()
f = FakePercent()
val, pc = f.next()
c = page.add(f'example', ui.large_bar_stat_card(
    box='1 1 2 2',
    title=fake.cryptocurrency_name(),
    value='=${{intl foo minimum_fraction_digits=2 maximum_fraction_digits=2}}',
    value_caption='This Month',
    aux_value='={{intl bar style="unit" unit="percent" minimum_fraction_digits=2 maximum_fraction_digits=2}}',
    aux_value_caption='Previous Month',
    plot_color='$red',
    progress=pc,
    data=dict(foo=val, bar=pc * 100),
    caption=' '.join(fake.sentences(2)),
))
page.sync()

while True:
    time.sleep(1)
    val, pc = f.next()
    c.data.foo = val
    c.data.bar = pc * 100
    c.progress = pc
    page.sync()
