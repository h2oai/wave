# Lesson 3: Flex Layout
# # Flex layout - the responsive way
# If you would like your Wave app/script to look good on every screen (make it [responsive](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design)), you need to go for
# a flex layout. Flex standing for flexible.
# 
# The layout will be specified in a card called `meta_card` which is used for not directly visible page configuration like layout or color theme for example.
# Basic building block of the layout is called `ui.zone` which allows you to specify it's direction (row/col), alignment or size.
# 
# Good news is that layout tries to adjust itself based on the card content which means minimal unnecessary whitespace and scrollbars by default.
# 
# See [docs](https://wave.h2o.ai/docs/layout#flex-layout) for further info.
# 
# ## Your task
# Try to add a new card to the "bottom zone". Note: You will need to come up with a page key that doesn't exist yet in order to not overwrite the existing card. You cannot pick "top_hello" for example.
# 
# As an extra task, open new tab at `/demo` path and verify if it really looks good on bigger screen size. If you are running this app locally, the URL would be
# <http://localhost:10101/demo>.
# ---
from h2o_wave import site, ui

page = site['/demo']

page['meta'] = ui.meta_card(box='', layouts=[
    ui.layout(
        breakpoint='xs',
        zones=[
            ui.zone('top_zone'),
            ui.zone('body', direction=ui.ZoneDirection.ROW, zones=[
                ui.zone('lhs', size='75%'),
                ui.zone('rhs', size='25%'),
            ]),
            ui.zone('bottom_zone'),
        ]
    )
])

page['top_hello'] = ui.markdown_card(
    box='top_zone',
    title='Hello World!',
    content='And now for something completely different!',
)
page['lhs_hello'] = ui.markdown_card(
    box='lhs',
    title='Hello World!',
    content='And now for something completely different!',
)
page['rhs_hello'] = ui.markdown_card(
    box='rhs',
    title='Hello World!',
    content='And now for something completely different!',
)
page['bottom_hello'] = ui.markdown_card(
    box='bottom_zone',
    title='Hello World!',
    content='And now for something completely different!',
)

page.save()
