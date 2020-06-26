# Form / Separator
# No description available.
# ---
from telesync import site, ui

page = site['/demo']

page['hello'] = ui.form_card(
    box='1 1 2 5',
    items=[
        ui.separator(label='Separator 1'),
        ui.text('The quick brown fox jumps over the lazy dog.'),
        ui.separator(label='Separator 2'),
        ui.text('The quick brown fox jumps over the lazy dog.'),
        ui.separator(label='Separator 3'),
        ui.text('The quick brown fox jumps over the lazy dog.'),
    ]
)

page.sync()
