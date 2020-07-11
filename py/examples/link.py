# Form / Link
# No description available.
# ---
from telesync import site, ui

page = site['/demo']

page['example'] = ui.form_card(
    box='1 1 4 -1',
    items=[
        ui.link(label='Internal link', path='/starred'),
        ui.link(label='Internal link, disabled', path='/starred', disabled=True),
        ui.link(label='External link', path='https://h2o.ai'),
        ui.link(label='External link, disabled', path='https://h2o.ai', disabled=True),
    ]
)
page.sync()
