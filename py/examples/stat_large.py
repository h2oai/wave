# Stat / Large
# Create a stat card displaying a primary value, an auxiliary value and a caption.
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
c = page.add('example', ui.large_stat_card(
    box='1 1 2 2',
    title=fake.cryptocurrency_name(),
    value='=${{intl qux minimum_fraction_digits=2 maximum_fraction_digits=2}}',
    aux_value='={{intl quux style="percent" minimum_fraction_digits=1 maximum_fraction_digits=1}}',
    data=dict(qux=val, quux=pc),
    caption=' '.join(fake.sentences()),
))
page.save()

while True:
    time.sleep(1)
    val, pc = f.next()
    c.data.qux = val
    c.data.quux = pc
    page.save()
