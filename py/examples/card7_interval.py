# Card7 / Interval
# No description available.
# ---
import time

from faker import Faker

from synth import FakeCategoricalSeries
from telesync import Site, ui, data

site = Site()

page = site['/demo']

fake = Faker()
f = FakeCategoricalSeries()
cat, val, pc = f.next()
c = page.add(f'example', ui.card7_card(
    box='1 1 1 1',
    title=fake.cryptocurrency_name(),
    value='=${{intl qux minimum_fraction_digits=2 maximum_fraction_digits=2}}',
    data=dict(qux=val, quux=pc),
    plot_category='foo',
    plot_type='interval',
    plot_value='qux',
    plot_color='$red',
    plot_data=data('foo qux', -20),
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
