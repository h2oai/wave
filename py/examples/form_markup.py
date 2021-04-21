# Form / Markup
# Use a #markup component to display formatted content using #HTML.
# #form
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

page['example'] = ui.form_card(
    box='1 1 2 2',
    items=[
        ui.markup(content=menu)
    ]
)
page.save()
