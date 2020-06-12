# Card1
# No description available.
# ---
import time

from faker import Faker

from synth import FakePercent
from telesync import Site, ui

site = Site()

page = site['/demo']

fake = Faker()
f = FakePercent()
val, _ = f.next()
c = page.add('example', ui.card1_card(
    box=f'1 1 1 1',
    title=fake.cryptocurrency_name(),
    value=f'${val:.2f}',
))
page.sync()

while True:
    time.sleep(1)
    val, _ = f.next()
    c.value = f'${val:.2f}'
    page.sync()
