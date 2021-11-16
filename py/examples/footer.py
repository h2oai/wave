# Footer
# Use a footer card to display a page #footer.
# ---
from h2o_wave import site, ui

page = site['/demo']
caption = '''
![theme-generator](https://wave.h2o.ai/img/logo.svg)

Made with 💛 by H2O Wave Team.'''
page['footer1'] = ui.footer_card(box='1 1 -1 1', caption='Made with 💛 by H2O Wave Team.')
page['footer2'] = ui.footer_card(box='1 2 -1 3', caption=caption)
page['footer3'] = ui.footer_card(
    box='1 5 -1 3',
    caption=caption,
    items=[
        ui.inline(justify='end', items=[
            ui.links(label='First Column', width='200px', items=[
                ui.link(label='Sample link', path='https://www.h2o.ai/', target='_blank'),
                ui.link(label='Sample link', path='https://www.h2o.ai/', target='_blank'),
                ui.link(label='Sample link', path='https://www.h2o.ai/', target='_blank'),
            ]),
            ui.links(label='Second Column', width='200px', items=[
                ui.link(label='Sample link', path='https://www.h2o.ai/', target='_blank'),
                ui.link(label='Sample link', path='https://www.h2o.ai/', target='_blank'),
                ui.link(label='Sample link', path='https://www.h2o.ai/', target='_blank'),
            ]),
            ui.links(label='Third Column', width='200px', items=[
                ui.link(label='Sample link', path='https://www.h2o.ai/', target='_blank'),
                ui.link(label='Sample link', path='https://www.h2o.ai/', target='_blank'),
                ui.link(label='Sample link', path='https://www.h2o.ai/', target='_blank'),
            ]),
        ]),
    ]
)
page.save()
