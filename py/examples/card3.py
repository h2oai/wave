# Card3
# No description available.
# ---
from telesync import Site, ui, data
from faker import Faker
from synth import FakePercent, FakeCategoricalSeries
import time

site = Site()

page = site['/demo']

fake = Faker()
f = FakePercent()
val, pc = f.next()
c = page.add(f'example', ui.card3_card(
    box='1 1 2 2',
    title=fake.cryptocurrency_name(),
    value='=${{intl qux minimum_fraction_digits=2 maximum_fraction_digits=2}}',
    aux_value='={{intl quux style="unit" unit="percent" minimum_fraction_digits=1 maximum_fraction_digits=1}}',
    data=dict(qux=val, quux=pc * 100),
    caption=' '.join(fake.sentences()),
))
page.sync()

while True:
    time.sleep(1)
    val, pc = f.next()
    c.data.qux = val
    c.data.quux = pc * 100
    page.sync()
