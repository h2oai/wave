# Meta / Theme
# Turn off live updates for static pages to conserve server resources.
# ---
from h2o_wave import site, ui

page = site['/demo']

# Set refresh rate to zero ("no updates")
page['meta'] = ui.meta_card(box='', theme='neon')

page['example'] = ui.markdown_card(
    box='1 1 2 2',
    title='Look at those colors',
    content='This is a neon theme!',
)

page.save()
