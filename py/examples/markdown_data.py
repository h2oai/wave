# Markdown / Data
# Display dynamic formatted content using #markdown.
# ---
import time
from h2o_wave import site, ui

page = site['/demo']

beer_verse = '''
{{before}} bottles of beer on the wall, {{before}} bottles of beer.

Take one down, pass it around, {{after}} bottles of beer on the wall...
'''

beer_card = page.add('example', ui.markdown_card(
    box='1 1 4 2',
    title='99 Bottles of Beer',
    content='=' + beer_verse,  # Make the verse a template expression by prefixing a '='.
    data=dict(before='99', after='98'),
))

page.save()

for i in range(98, 2, -1):
    time.sleep(1)
    beer_card.data.before = str(i)
    beer_card.data.after = str(i - 1)
    page.save()
