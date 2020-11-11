# Layout / Responsive
# How to create a responsive layout.
# ---

from h2o_wave import site, ui

page = site['/demo']
page.drop()

# The meta card's 'areas' attribute defines placeholder areas to lay out cards for different viewport sizes.
# We define three layout schemes here.
page['meta'] = ui.meta_card(box='', layouts=[
    ui.layout(
        # If the viewport width >= 0:
        breakpoint='xs',
        area=ui.area('main', areas=[
            ui.area('header', size='80px'),
            ui.area('content')
        ])
    ),
    ui.layout(
        # If the viewport width >= 768:
        breakpoint='m',
        area=ui.area('main', areas=[
            ui.area('header', size='80px'),
            ui.area('body', direction='row', areas=[
                ui.area('sidebar', size='250px'),
                ui.area('content'),
            ]),
        ])
    ),
    ui.layout(
        # If the viewport width >= 1200:
        breakpoint='xl',
        width='1200px',
        area=ui.area('main', areas=[
            ui.area('header', size='80px'),
            ui.area('body', direction='row', areas=[
                ui.area('sidebar', size='300px'),
                ui.area('other', areas=[
                    ui.area('charts', direction='row'),
                    ui.area('content'),
                ]),
            ])
        ])
    )
])
page['header'] = ui.header_card(
    box='header / header / header',
    title='Lorem Ipsum',
    subtitle='Excepteur sint occaecat cupidatat',
    nav=[
        ui.nav_group('Menu', items=[
            ui.nav_item(name='#menu/spam', label='Spam'),
            ui.nav_item(name='#menu/ham', label='Ham'),
            ui.nav_item(name='#menu/eggs', label='Eggs'),
        ]),
        ui.nav_group('Help', items=[
            ui.nav_item(name='#about', label='About'),
            ui.nav_item(name='#support', label='Support'),
        ])
    ],
)
page['controls'] = ui.markdown_card(
    box='content#1 / sidebar / sidebar',
    title='Controls',
    content='',
)
page['chart1'] = ui.markdown_card(
    box='content#2 / content#1 / charts#1 2',
    title='Chart 1',
    content='',
)
page['chart2'] = ui.markdown_card(
    box='content#3 / content#2 / charts#2 1',
    title='Chart 2',
    content='',
)
page['content'] = ui.markdown_card(
    box='content#4 / content#3 / content',
    title='Content',
    content='',
)

page.save()
