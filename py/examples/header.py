# Header
# Use a header card to display a page #header.
# ---
from h2o_wave import site, ui

page = site['/demo']
page['header1'] = ui.header_card(
    box='1 1 3 1',
    title='The Amazing Gonkulator',
    subtitle='And now for something completely different!',
)
page['header2'] = ui.header_card(
    box='1 2 3 1',
    title='The Amazing Gonkulator',
    subtitle='And now for something completely different!',
    icon='Design',
)
page['header3'] = ui.header_card(
    box='1 3 3 1',
    title='The Amazing Gonkulator',
    subtitle='And now for something completely different!',
    icon='Cycling',
    icon_color='$violet',
)
page['header4'] = ui.header_card(
    box='1 4 3 1',
    title='The Amazing Gonkulator',
    subtitle='And now for something completely different!',
    icon='ExploreData',
    icon_color='$red',
)
page.save()
