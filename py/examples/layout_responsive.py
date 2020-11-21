# Layout / Responsive
# How to create a responsive layout.
# ---
from h2o_wave import site, ui

page = site['/demo']
page.drop()

# The meta card's 'zones' attribute defines placeholder zones to lay out cards for different viewport sizes.
# We define three layout schemes here.
page['meta'] = ui.meta_card(box='', layouts=[
    ui.layout(
        # If the viewport width >= 0:
        breakpoint='xs',
        zones=[
            ui.zone('header', size='80px'),
            ui.zone('content')
        ]
    ),
    ui.layout(
        # If the viewport width >= 768:
        breakpoint='m',
        zones=[
            ui.zone('header', size='80px'),
            ui.zone('body', direction='row', zones=[
                ui.zone('sidebar', size='250px'),
                ui.zone('content'),
            ]),
        ]
    ),
    ui.layout(
        # If the viewport width >= 1200:
        breakpoint='xl',
        width='1200px',
        zones=[
            ui.zone('header', size='80px'),
            ui.zone('body', direction='row', zones=[
                ui.zone('sidebar', size='300px'),
                ui.zone('other', zones=[
                    ui.zone('charts', direction='row'),
                    ui.zone('content'),
                ]),
            ])
        ]
    )
])

page['header'] = ui.header_card(
    box='header',
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
    box=ui.boxes('content', 'sidebar', 'sidebar'),
    title='Controls',
    content='',
)
page['chart1'] = ui.markdown_card(
    box=ui.boxes(ui.box('content', 2), ui.box('content'), ui.box('charts', 1, '2')),
    title='Chart 1',
    content='',
)
page['chart2'] = ui.markdown_card(
    box=ui.boxes(ui.box('content', 3), ui.box('content', 2), ui.box('charts', 2, '1')),
    title='Chart 2',
    content='',
)
page['content'] = ui.markdown_card(
    box=ui.boxes(ui.box('content', 4), ui.box('content', 3), 'content'),
    title='Content',
    content='',
)

page.save()
