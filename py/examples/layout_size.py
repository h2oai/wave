# Layout / Size
# How to adjust the size of cards on a page. #layout
# ---

from h2o_wave import site, ui

# Every page has a grid system in place.
# The grid has 12 columns and 10 rows.
# A column is 134 pixels wide.
# A row is 76 pixels high.
# The gap between rows and columns is set to 15 pixels.

# Cards have a `box` attribute that specifies its column, row, width and height.
# box = 'column row width height'
# They indicate the 1-based column/row to position the top-left corner of the card.

# In this example, we place multiple cards on a page to demonstrate their `box` values.

page = site['/demo']
boxes = [
    '1 1 1 1',
    '2 1 2 1',
    '4 1 3 1',
    '7 1 4 1',
    '11 1 2 2',
    '1 2 1 9',
    '2 2 1 4',
    '3 2 1 2',
    '2 6 1 5',
    '3 4 1 7',
    '4 2 7 9',
    '11 9 2 2',
    '11 3 2 6',
]

for box in boxes:
    page[f'card_{box.replace(" ", "_")}'] = ui.markdown_card(box=box, title=box, content='')

page.save()
