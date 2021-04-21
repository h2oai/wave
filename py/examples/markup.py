# Markup
# Use a #markup card to display formatted content using #HTML.
# ---
from h2o_wave import site, ui

page = site['/demo']

menu = '''
<ol>
    <li>Spam</li>
    <li>Ham</li>
    <li>Eggs</li>
</ol>
'''

page['example'] = ui.markup_card(
    box='1 1 2 2',
    title='Menu',
    content=menu,
)
page.save()
