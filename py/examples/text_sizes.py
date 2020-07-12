# Form / Text / Sizes
# Use text size variants to display formatted text using predefined font sizes.
# ---
from telesync import site, ui

page = site['/demo']

page['example'] = ui.form_card(
    box='1 1 4 -1',
    items=[
        ui.separator('Separator'),
        ui.text_xl('Extra large text'),
        ui.text_l('Large text'),
        ui.text('Normal text'),
        ui.text_m('Medium text'),
        ui.text_s('Small text'),
        ui.text_xs('Extra small text'),

        # Using `ui.text()` with a `size` argument produces similar results:
        ui.separator('Separator'),
        ui.text('Extra large text', size='xl'),
        ui.text('Large text', size='l'),
        ui.text('Normal text'),
        ui.text('Medium text', size='m'),
        ui.text('Small text', size='s'),
        ui.text('Extra small text', size='xs'),
    ],
)
page.sync()
