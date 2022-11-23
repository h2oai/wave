# Lesson 4: World of Widgets
# # Let's add some bells and whistles!
# One of the Wave's main advantages against our competitors is it's large collections of highly polished, ready-to-use widgets.
# Please go through the [list of all the widgets](https://wave.h2o.ai/docs/widgets/overview#content) and find the ones that best fit your usecase.
# ## Your task
# Try to replace the body right-hand side (RHS) and left-hand side(LHS) with a widget of your choice from the above linked list.
# ---
from h2o_wave import site, ui

page = site['/demo']

page['meta'] = ui.meta_card(box='', layouts=[
    ui.layout(
        breakpoint='xs',
        zones=[
            ui.zone('header'),
            ui.zone('body', direction=ui.ZoneDirection.ROW, size='200px', zones=[
                ui.zone('lhs', size='75%'),
                ui.zone('rhs', size='25%'),
            ]),
            ui.zone('footer'),
        ]
    )
])

page['header'] = ui.header_card(
    box='header',
    title='Hello World!',
    subtitle="Not bad, isn't it?",
    image='https://wave.h2o.ai/img/logo.svg',
)
page['rhs_hello'] = ui.markdown_card(
    box='lhs',
    title='Hello World!',
    content='And now for something completely different!',
)
page['lhs_hello'] = ui.markdown_card(
    box='rhs',
    title='Hello World!',
    content='And now for something completely different!',
)

page['footer'] = ui.footer_card(box='footer', caption='''
![wave-logo](https://wave.h2o.ai/img/logo.svg)

Made with 💛 by H2O Wave Team.''')

page.save()
