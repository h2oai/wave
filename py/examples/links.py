# Form / Links
# Use links to allow #navigation to multiple internal and external URLs.
# #form #link
# ---
from h2o_wave import site, ui

page = site['/demo']

page['example'] = ui.form_card(
    box='1 1 3 3',
    items=[
        ui.text_l(content='**Vertical set of links with a label**'),
        ui.links(label='Second Column', items=[
            ui.link(label='Sample link', path='https://www.h2o.ai/', target='_blank'),
            ui.link(label='Sample link', path='https://www.h2o.ai/', target='_blank'),
            ui.link(label='Sample link', path='https://www.h2o.ai/', target='_blank'),
        ]),
        ui.text_l(content='**Horizontal set of links**'),
        ui.links(inline=True, items=[
            ui.link(label='Sample link', path='https://www.h2o.ai/', target='_blank'),
            ui.link(label='Sample link', path='https://www.h2o.ai/', target='_blank'),
            ui.link(label='Sample link', path='https://www.h2o.ai/', target='_blank'),
        ]),
    ]
)
page.save()
