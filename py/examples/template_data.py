# Template / Data
# Update a #template card's data periodically.
# ---
import time
import random
from h2o_wave import site, ui

page = site['/demo']
page.drop()

menu = '''
<ol>
{{#each dishes}}
<li><strong>{{name}}</strong> costs {{price}}</li>
{{/each}}
</ol
'''

menu_card = page.add('template_example', ui.template_card(
    box='1 1 2 2',
    title='Surge-priced Menu',
    content=menu,
    data=dict(dishes=[
        dict(name='Spam', price='$2.00'),
        dict(name='Ham', price='$3.45'),
        dict(name='Eggs', price='$1.75'),
    ]),
))
page.save()


def rand_price():
    return f'${random.randrange(0, 4)}.{random.randrange(10, 99)}'


dishes = menu_card.data.dishes
for i in range(98, 2, -1):
    time.sleep(1)
    dishes[0].price = rand_price()
    dishes[1].price = rand_price()
    dishes[2].price = rand_price()
    page.save()
