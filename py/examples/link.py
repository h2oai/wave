# Form / Link
# Use link to allow #navigation to internal and external URLs.
# #form #link
# ---
from h2o_wave import site, ui

page = site['/demo']

page['example'] = ui.form_card(
    box='1 1 4 7',
    items=[
        ui.link(label='Internal link', path='starred'),
        ui.link(label='Internal link, new tab', path='starred', target=''),
        ui.link(label='Internal link, new tab', path='starred', target='_blank'),  # same as target=''
        ui.link(label='Internal link, disabled', path='starred', disabled=True),
        ui.link(label='External link', path='https://h2o.ai'),
        ui.link(label='External link, new tab', path='https://h2o.ai', target=''),
        ui.link(label='External link, new tab', path='https://h2o.ai', target='_blank'),  # same as target=''
        ui.link(label='External link, disabled', path='https://h2o.ai', disabled=True),
        ui.link(label='Download link', path='http://localhost:10101/assets/brand/h2o-wave-b&w.png', download=True),
    ]
)
page.save()
