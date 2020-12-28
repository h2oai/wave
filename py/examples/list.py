# Lists
# Use list cards to lay out multiple child cards in the form of a #list.
# ---
import random

from faker import Faker

from h2o_wave import site, ui, pack, data

fake = Faker()

page = site['/demo']

c = page.add('example', ui.list_card(
    box='1 1 2 4',
    item_view='list_item1',
    item_props=pack(dict(title='=code', caption='=currency', value='=trades', aux_value='=returns')),
    title='Exchange Rates',
    data=data('currency code trades returns', -15),
))
c.data = [[fake.cryptocurrency_name(), fake.cryptocurrency_code(), random.randint(100, 1000), random.randint(10, 100)]
          for _ in range(15)]

page.save()
