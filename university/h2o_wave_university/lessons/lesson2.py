# Lesson 2: Grid Layout
# # Laying out the cards - the simple way
# By default, every page has a grid system in place, designed to fit HD displays (1920 x 1080 pixels). The grid has 12 columns and 10 rows. A column is 134 pixels wide. A row is 76 pixels high. The gap between rows and columns is set to 15 pixels.
# 
# Every card has a `box` attribute that specifies how to position the card on the page, a string of the form `'column row width height'`, for example `'1 1 2 4'` or `'8 7 3 6'`.
# 
# See [docs](https://wave.h2o.ai/docs/layout#grid-layout) for furhter info.
# 
# The downside to this kind of layout is that it's static - it's the same irrespective of the screen size. Let's see a better solution in the next lesson.
# ## Your task
# Try changing box attribute and see how card's dimensions change.
# ---
from h2o_wave import site, ui

page = site['/demo']

page['hello'] = ui.markdown_card(
    box='1 1 2 2',
    title='Hello World!',
    content='And now for something completely different!',
)

page.save()
