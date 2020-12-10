# Grid
# Use a grid card to lay out multiple child cards in table form.
# ---

from h2o_wave import site, ui, pack, data

page = site['/demo']

c = page.add('example', ui.grid_card(
    box='1 1 3 4',
    title='Currency Trades',
    cells=pack([
        dict(title='Currency', value='=currency'),
        dict(title='Trades',
             view='list_item1',
             props=dict(title='=code', caption='1 hour ago', value='=trades', aux_value='=returns')),
    ]),
    data=data(fields=['currency', 'code', 'trades', 'returns'], size=-15),
))
c.data = [
    ['Bitcoin', 'ETC', 146, 17],
    ['Namecoin', 'STC', 858, 70],
    ['Sirin Labs', 'AUR', 149, 79],
    ['AMP', 'EMC', 632, 43],
    ['BlackCoin', 'NEM', 799, 31],
    ['Primecoin', 'STC', 944, 91],
    ['AMP', 'BURST', 127, 39],
    ['XEM', 'STC', 832, 11],
    ['Burstcoin', 'ETC', 177, 81],
    ['Decred', 'DRC', 944, 43],
    ['Feathercoin', 'DOGE', 800, 89],
    ['Bitcoin', 'IOTA', 172, 39],
    ['Burstcoin', 'LTC', 480, 25],
    ['Bytecoin', 'MZC', 698, 92],
    ['Auroracoin', 'FTH', 882, 73]]

page.save()
