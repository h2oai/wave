# Layout / Responsive
# How to create a #responsive #layout.
# ---
from h2o_wave import site, ui

page = site['/demo']
page.drop()

content = '![Fill Murray](https://www.fillmurray.com/640/360)'

# The meta card's 'zones' attribute defines placeholder zones to lay out cards for different viewport sizes.
# We define three layout schemes here.
page['meta'] = ui.meta_card(box='', layouts=[
    ui.layout(
        # If the viewport width >= 0:
        breakpoint='xs',
        zones=[
            # 80px high header
            ui.zone('header', size='80px'),
            # Use remaining space for content
            ui.zone('content')
        ]
    ),
    ui.layout(
        # If the viewport width >= 768:
        breakpoint='m',
        zones=[
            # 80px high header
            ui.zone('header', size='80px'),
            # Use remaining space for body
            ui.zone('body', direction=ui.ZoneDirection.ROW, zones=[
                # 250px wide sidebar
                ui.zone('sidebar', size='250px'),
                # Use remaining space for content
                ui.zone('content'),
            ]),
            ui.zone('footer'),
        ]
    ),
    ui.layout(
        # If the viewport width >= 1200:
        breakpoint='xl',
        width='1200px',
        zones=[
            # 80px high header
            ui.zone('header', size='80px'),
            # Use remaining space for body
            ui.zone('body', direction=ui.ZoneDirection.ROW, zones=[
                # 300px wide sidebar
                ui.zone('sidebar', size='300px'),
                # Use remaining space for other widgets
                ui.zone('other', zones=[
                    # Use one half for charts
                    ui.zone('charts', direction=ui.ZoneDirection.ROW),
                    # Use other half for content
                    ui.zone('content'),
                ]),
            ]),
            ui.zone('footer'),
        ]
    )
])

page['header'] = ui.header_card(
    # Place card in the header zone, regardless of viewport size.
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
    # If the viewport width >= 0, place in content zone.
    # If the viewport width >= 768, place in sidebar zone.
    # If the viewport width >= 1200, place in sidebar zone.
    box=ui.boxes('content', 'sidebar', 'sidebar'),
    title='Controls',
    content=content,
)
page['chart1'] = ui.markdown_card(
    box=ui.boxes(
        # If the viewport width >= 0, place as second item in content zone.
        ui.box(zone='content', order=2),
        # If the viewport width >= 768, place in content zone.
        'content',
        # If the viewport width >= 1200, place as first item in charts zone, use 2 parts of available space.
        ui.box(zone='charts', order=1, size=2),
    ),
    title='Chart 1',
    content=content,
)
page['chart2'] = ui.markdown_card(
    box=ui.boxes(
        # If the viewport width >= 0, place as third item in content zone.
        ui.box(zone='content', order=3),
        # If the viewport width >= 768, place as second item in content zone.
        ui.box(zone='content', order=2),
        # If the viewport width >= 1200, place as second item in charts zone, use 1 part of available space.
        ui.box(zone='charts', order=2, size=1),
    ),
    title='Chart 2',
    content=content,
)
page['content'] = ui.markdown_card(
    box=ui.boxes(
        # If the viewport width >= 0, place as fourth item in content zone.
        ui.box(zone='content', order=4),
        # If the viewport width >= 768, place as third item in content zone.
        ui.box(zone='content', order=3),
        # If the viewport width >= 1200, place in content zone.
        'content',
    ),
    title='Content',
    content=content,
)
page['footer'] = ui.footer_card(box='footer', caption='(c) 2020 Lowest Common Denominator, Inc. ')

page.save()
