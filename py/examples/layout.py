# Layout / Position
# How to adjust the position of cards on a page.
# #layout
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

# In this example, we place a 1x1 card in each column/row on a page
# to demonstrate their column/row values.

page = site['/demo']
columns = 12
rows = 10

for column in range(1, columns + 1):
    for row in range(1, rows + 1):
        box = f'{column} {row} 1 1'
        page[f'card_{column}_{row}'] = ui.markdown_card(box=box, title=box, content='')

page.save()
