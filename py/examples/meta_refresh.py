# Meta / Refresh
# Turn off live updates for static pages to conserve server resources.
# #meta #refresh
# ---
from h2o_wave import site, ui

page = site['/demo']

# Set refresh rate to zero ("no updates")
page['meta'] = ui.meta_card(box='', refresh=0)

page['example'] = ui.markdown_card(
    box='1 1 2 2',
    title='No updates for you',
    content='This page stops receiving updates once loaded.',
)

page.save()
