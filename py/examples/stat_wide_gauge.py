# Stat / Gauge / Wide
# Create a wide stat card displaying a primary value, an auxiliary value and a #progress gauge.
# #stat_card
# ---
import time

from faker import Faker

from synth import FakePercent
from h2o_wave import site, ui

page = site['/demo']

fake = Faker()
f = FakePercent()
val, pc = f.next()
c = page.add('example', ui.wide_gauge_stat_card(
    box='1 1 2 1',
    title=fake.cryptocurrency_name(),
    value='=${{intl foo minimum_fraction_digits=2 maximum_fraction_digits=2}}',
    aux_value='={{intl bar style="percent" minimum_fraction_digits=2 maximum_fraction_digits=2}}',
    plot_color='$red',
    progress=pc,
    data=dict(foo=val, bar=pc),
))
page.save()

while True:
    time.sleep(1)
    val, pc = f.next()
    c.data.foo = val
    c.data.bar = pc
    c.progress = pc
    page.save()
