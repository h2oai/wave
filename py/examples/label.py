# Form / Label
# No description available.
# ---
from telesync import Site, ui

site = Site()
page = site['/demo']

page['hello'] = ui.form_card(
    box='1 1 4 -1',
    items=[
        ui.label(label='Standard Label'),
        ui.label(label='Required Label', required=True),
        ui.label(label='Disabled Label', disabled=True),
    ]
)
page.sync()
