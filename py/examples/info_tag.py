# Info Tag
# Create 2 rows of information tags with different colors and sizes.
# ---
from h2o_wave import site, ui

page = site['/demo']

error = '#610404'
warning = '#7F6001'
success = '#054007'

page['example'] = ui.form_card(
    box='1 1 2 2',
    items=[
        ui.inline(justify='center', items=[
            ui.info_tag(name='tag-1', color=error, label='1', size='large'),
            ui.info_tag(name='tag-2', color=warning, label='2', size='large'),
            ui.info_tag(name='tag-3', color=success, label='3', size='large'),
        ]),
        ui.inline(justify='center', items=[
            ui.info_tag(name='tag-4', color=error, label='1', size='small'),
            ui.info_tag(name='tag-5', color=warning, label='2', size='small'),
            ui.info_tag(name='tag-6', color=success, label='3', size='small'),
        ])
    ])

page.save()
