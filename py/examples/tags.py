# Tags
# Display a set of tags in a row. Each tag consists of a box with text inside.
# Can be used in different scenarios including highlighting a specific keyword or holding a numeric value with
# different colors to indicate error, warning, or success.
# ---
from h2o_wave import site, ui

page = site['/demo']

page['example'] = ui.form_card(
    box='1 1 2 2',
    items=[
        ui.tags([
            ui.tag(color='#610404', label='Error'),
            ui.tag(color='#7F6001', label='Warning'),
            ui.tag(color='#054007', label='Success'),
        ])
    ])

page.save()
