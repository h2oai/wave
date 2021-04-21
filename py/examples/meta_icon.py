# Meta / Icon
# Set the browser window #icon for a page. #meta
# ---
from h2o_wave import site, ui

page = site['/demo']

page['meta'] = ui.meta_card(box='', icon='https://en.wikipedia.org/static/apple-touch/wikipedia.png')

# You can also upload and assign an icon, like this:
# icon_path, = site.upload(['path/to/my/icon.png'])
# page['meta'] = ui.meta_card(box='', icon=icon_path)

page['example'] = ui.markdown_card(
    box='1 1 2 2',
    title='',
    content='<a href="/demo" target="_blank">Open this page in a new window</a> to view its icon.',
)

page.save()
