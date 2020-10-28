# Meta / Theme
# Change the base color theme of the app.
# ---
from h2o_wave import site, ui

page = site['/demo']

page['meta'] = ui.meta_card(box='', theme='neon')

page['example'] = ui.markdown_card(
    box='1 1 2 2',
    title='Look at those colors',
    content='This is a neon theme!',
)

page.save()
