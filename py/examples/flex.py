# Flex
# Use a flex card to tile multiple child cards along one dimension, with optional wrapping.
# #flex
# ---
import random

from faker import Faker

from h2o_wave import site, ui, pack, data

fake = Faker()

page = site['/demo']

c = page.add('example', ui.flex_card(
    box='1 1 1 1',
    direction='horizontal',
    justify='between',
    wrap='between',
    item_view='template',
    item_props=pack(dict(
        content='<div style="width:15px; height:15px; border-radius: 50%; background-color:{{#if loss}}red{{else}}green{{/if}}" title="{{code}}"/>'  # noqa: E501
    )),
    data=data('code loss', -10),
))
c.data = [[fake.cryptocurrency_code(), random.randint(0, 1)] for _ in range(10)]

page.save()
