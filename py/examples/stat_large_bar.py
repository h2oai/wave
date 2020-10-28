# Stat / Bar / Large
# Create a large captioned card displaying a primary value, an auxiliary value and a progress bar,
# with captions for each value.
# #stat_card #progress
# ---
import time

from faker import Faker

from synth import FakePercent
from h2o_wave import site, ui

page = site['/demo']

fake = Faker()
f = FakePercent()
val, pc = f.next()
c = page.add('example', ui.large_bar_stat_card(
    box='1 1 2 2',
    title=fake.cryptocurrency_name(),
    value='=${{intl foo minimum_fraction_digits=2 maximum_fraction_digits=2}}',
    value_caption='This Month',
    aux_value='={{intl bar style="percent" minimum_fraction_digits=2 maximum_fraction_digits=2}}',
    aux_value_caption='Previous Month',
    plot_color='$red',
    progress=pc,
    data=dict(foo=val, bar=pc),
    caption=' '.join(fake.sentences(2)),
))
page.save()

while True:
    time.sleep(1)
    val, pc = f.next()
    c.data.foo = val
    c.data.bar = pc
    c.progress = pc
    page.save()
