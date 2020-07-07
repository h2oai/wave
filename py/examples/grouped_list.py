# Form / Grouped List
# No description available.
# ---
from telesync import site, ui

page = site['/demo']

page['hello'] = ui.form_card(
    box='1 1 4 8',
    items=[
      ui.grouped_list()
    ]
)

page.sync()
