# Form / Frame / Path
# Use a #frame component in a #form card to display external web pages.
# ---
from h2o_wave import site, ui

page = site['/demo']

page['example'] = ui.form_card(
    box='1 1 6 5',
    items=[
        ui.frame(path='https://example.com', height='400px')
    ]
)

page.save()
