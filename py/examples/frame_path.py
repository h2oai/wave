# Frame / Path
# Use a #frame card to display external web pages.
# ---
from h2o_wave import site, ui

page = site['/demo']

page['example'] = ui.frame_card(
    box='1 1 6 5',
    title='Example',
    path='https://example.com',
)

page.save()
