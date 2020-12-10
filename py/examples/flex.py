# Flex
# Use a flex card to tile multiple child cards along one dimension, with optional wrapping.
# ---

from h2o_wave import site, ui, pack, data

page = site['/demo']

c = page.add('example', ui.flex_card(
    box='1 1 1 1',
    direction='horizontal',
    justify='between',
    wrap='between',
    item_view='template',
    item_props=pack(dict(
        content='<div style="width:15px; height:15px; border-radius: 50%; background-color:{{#if loss}}red{{else}}green{{/if}}" title="{{code}}"/>'
    )),
    data=data(fields=['code', 'loss'], size=-10),
))
c.data = [
    ['AMP', 1],
    ['WAVES', 0],
    ['STC', 1],
    ['ETC', 1],
    ['SRN', 1],
    ['WAVES', 0],
    ['EMC', 1],
    ['GRC', 1],
    ['XDN', 0],
    ['NEM', 1]]

page.save()
