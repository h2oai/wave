# Form / Progress
# No description available.
# ---
from telesync import site, ui

page = site['/demo']

page['example'] = ui.form_card(
    box='1 1 4 -1',
    items=[
        ui.progress(label='Indeterminate Progress', caption='Goes on forever'),
        ui.progress(label='Standard Progress', caption='Downloading the interwebs...', value=0.25),
    ]
)
page.sync()
