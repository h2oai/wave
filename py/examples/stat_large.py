# Stat / Large
# Create a stat card displaying a primary value, an auxiliary value and a caption.
# ---
import time

from faker import Faker

from synth import FakePercent
from telesync import site, ui

page = site['/demo']

fake = Faker()
f = FakePercent()
val, pc = f.next()
c = page.add(f'example', ui.large_stat_card(
    box='1 1 2 2',
    title=fake.cryptocurrency_name(),
    value='=${{intl qux minimum_fraction_digits=2 maximum_fraction_digits=2}}',
    aux_value='={{intl quux style="unit" unit="percent" minimum_fraction_digits=1 maximum_fraction_digits=1}}',
    data=dict(qux=val, quux=pc * 100),
    caption=' '.join(fake.sentences()),
))
page.save()

while True:
    time.sleep(1)
    val, pc = f.next()
    c.data.qux = val
    c.data.quux = pc * 100
    page.save()
