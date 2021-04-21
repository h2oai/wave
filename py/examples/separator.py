# Form / Separator
# Use a #separator to visually separate content into groups.
# #form
# ---
from h2o_wave import site, ui

page = site['/demo']

page['example'] = ui.form_card(
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

page.save()
