# Card2 / Interval
# No description available.
# ---
from telesync import Site, ui, data
from faker import Faker
from synth import FakePercent, FakeCategoricalSeries
import time

site = Site()

page = site['/demo']

fake = Faker()
f = FakeCategoricalSeries()
cat, val, pc = f.next()
c = page.add(f'example', ui.card2_card(
    box='1 1 2 1',
    title=fake.cryptocurrency_name(),
    value='=${{intl qux minimum_fraction_digits=2 maximum_fraction_digits=2}}',
    aux_value='={{intl quux style="unit" unit="percent" minimum_fraction_digits=1 maximum_fraction_digits=1}}',
    data=dict(qux=val, quux=pc),
    plot_category='foo',
    plot_type='interval',
    plot_value='qux',
    plot_color='$red',
    plot_data=data('foo qux', -15),
    plot_zero_value=0,
))
page.sync()

while True:
    time.sleep(1)
    cat, val, pc = f.next()
    c.data.qux = val
    c.data.quux = pc
    c.plot_data[-1] = [cat, val]
    page.sync()
