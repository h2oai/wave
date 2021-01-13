# Stat / Small
# Create a stat card displaying a single value.
# #stat_card
# ---
import time

from faker import Faker

from synth import FakePercent
from h2o_wave import site, ui

page = site['/demo']

fake = Faker()
f = FakePercent()
val, _ = f.next()
c = page.add('example', ui.small_stat_card(
    box='1 1 1 1',
    title=fake.cryptocurrency_name(),
    value=f'${val:.2f}',
))
page.save()

while True:
    time.sleep(1)
    val, _ = f.next()
    c.value = f'${val:.2f}'
    page.save()
