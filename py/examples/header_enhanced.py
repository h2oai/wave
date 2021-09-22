# Header
# Use a header card to display a page #header.
# ---
from h2o_wave import main, app, Q, ui

image = 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&h=750&w=1260'

@app('/demo')
async def serve(q: Q):
    q.page['meta'] = ui.meta_card(box='', theme='darkBlue', layouts = [
        ui.layout(
            breakpoint='xl',
            zones=[
                ui.zone('header'),
            ]
        ),
    ])

    q.page['example_header'] = ui.header_card(
        box='header',
        title='H2O Model Monitoring',
        subtitle='Monitor your models and features',
        icon='ExploreData',
        icon_color='$themePrimary',
        search_name="searchbox_icon",
        items=[
            ui.icon_notification(icon='Ringer', icon_color='$themePrimary', notification_count="12"), 
            ui.icon_notification(icon='Settings', icon_color='$themePrimary', notification_count="!"), 
            ui.frame(width='60px', height='0px'),
            ui.persona(title='John Doe', subtitle='Frontend developer', caption='Online', size='xs', image=image),
            ui.button(name="chevron_down", icon="ChevronDownSmall")
        ],
        nav=[
            ui.nav_group('Menu', items=[
                ui.nav_item(name='#menu/dashboard', label='Dashboard'),
                ui.nav_item(name='#menu/all-projects', label='All projects'),
                ui.nav_item(name='#menu/sample-data', label='Sample data'),
                ui.nav_item(name='#menu/help', label='Help'),
            ]),
            ui.nav_group('Help', items=[
                ui.nav_item(name='#about', label='About'),
                ui.nav_item(name='#support', label='Support'),
            ])
        ]
    )

    await q.page.save()