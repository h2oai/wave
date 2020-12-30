# Meta / Title
# Set the browser window title for a page. #meta
# ---
from h2o_wave import site, ui

page = site['/demo']

page['meta'] = ui.meta_card(box='', title='And now for something completely different!')

page['example'] = ui.markdown_card(
    box='1 1 2 2',
    title='',
    content='<a href="/demo" target="_blank">Open this page in a new window</a> to view its title.',
)

page.save()
