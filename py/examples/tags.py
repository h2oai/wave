# Tags
# Display a set of tags in a row. Each tag consists of a box with text inside.
# Can be used in different scenarios including highlighting a specific keyword or holding a numeric value with
# different colors to indicate error, warning, or success.
# ---
from h2o_wave import site, ui

page = site['/demo']

error = '#610404'
warning = '#7F6001'
success = '#054007'

page['example'] = ui.form_card(
    box='1 1 2 2',
    items=[
        ui.tags([
            ui.tag(color=error, label='1'),
            ui.tag(color=warning, label='2'),
            ui.tag(color=success, label='3'),
        ]),
        ui.tags([
            ui.tag(color=error, label='Error'),
            ui.tag(color=warning, label='Warning'),
            ui.tag(color=success, label='Success'),
        ])
    ])

page.save()
